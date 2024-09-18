import { Body, Controller, Get, HttpStatus, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostService } from "./post.service";
import { Request, Response } from 'express';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/schemas/user.schema";
import { Model } from 'mongoose';
import { GlobalStateService } from "src/utils/global-state.service";
import * as path from 'path';
import * as fs from 'fs';
import { BullQueueService } from "src/config/taskSheduler/bullQueue";
import { ScheduledPost, ScheduledPostDocument } from "src/schemas/shedulePost.shcema";
import { diskStorage } from "multer";
import { PostDocument } from "src/schemas/post.schema";


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
        , @InjectModel(User.name) private userModel: Model<UserDocument>
        , @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>
        , private readonly globalStateService: GlobalStateService
        , private readonly bullQueueService: BullQueueService
        , @InjectModel('Post') private postModel: Model<PostDocument>

    ) { }

    @Get('charLimits')
    async fetchCharLimits(@Req() req: Request, @Res() res: Response) {
        try {
            const charLimits = await this.postService.fetchCharacterLimits();
            return res.status(HttpStatus.OK).json(charLimits);
        } catch (error) {
            console.error("Error fetching character limits:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './public/postImages',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = path.extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
    }))
    async createPost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
        try {
            console.log("File received:", file);
            console.log("Body received:", body);

            const userId = this.globalStateService.getUserId();
            const foundUser = await this.userModel.findById(userId);

            console.log('foundUser', foundUser);

            if (!foundUser) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found.',
                });
            }

            const socialAccessTokens = foundUser.socialAccessTokens;
            const content = JSON.parse(body.content);

            let imageUrl = null;
            if (file) {
                imageUrl = await this.postService.uploadImageToS3(file);
            }

            const results = await this.postService.createPost(
                content,
                file,
                socialAccessTokens
            );

            const newPost = new this.postModel({
                userId,
                content,
                platforms: results.map(result => ({
                    platform: result.platform,
                    response: result.response || result.error,
                })),
                image: imageUrl,
                createdAt: new Date(),
            });
            await newPost.save();

            if (file) {
                const filePath = path.join(process.cwd(), 'public', 'postImages', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Failed to delete the file:', err.message);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }

            return res.status(HttpStatus.CREATED).json({
                message: 'Post created successfully on all platforms!',
                results: results.map(result => result.response || result.error),
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error occurred while creating the post.',
                error: error.response ? error.response.data : error.message,
            });
        }
    }


    @Get('hashtags')
    async getHashtags(@Query('keyword') keyword: string): Promise<string[]> {
        console.log("Ethu");
        return this.postService.fetchHashtags(keyword);
    }

    @Post('schedule')
    @UseInterceptors(FileInterceptor('image'))
    async schedulePost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
        try {
            const userId = this.globalStateService.getUserId();
            const foundUser = await this.userModel.findById(userId);

            if (!foundUser) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found.' });
            }

            const socialAccessTokens = foundUser.socialAccessTokens;
            const content = JSON.parse(body.content);
            const scheduledTime = new Date(body.scheduledTime);

            let imageUrl = null;
            if (file) {
                imageUrl = await this.postService.uploadImageToS3(file);
            }

            const platforms = Object.keys(content);

            const scheduledPost = new this.scheduledPostModel({
                userId,
                content,
                platforms,
                image: imageUrl,
                scheduledTime,
                status: 'scheduled',
            });

            await scheduledPost.save();

            const jobData = {
                _id: scheduledPost._id,
                userId,
                content,
                fileUrl: imageUrl,
                socialAccessTokens,
                scheduledTime,
            };

            const jobId = await this.bullQueueService.addPostToQueue(jobData);

            scheduledPost.jobId = jobId;
            await scheduledPost.save();

            return res.status(HttpStatus.CREATED).json({ message: 'Post successfully scheduled.' });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while scheduling the post.', error: error.message });
        }
    }


    @Get('fetch-all-posts')
    async getScheduledPosts(@Res() res: Response) {
        try {
            const userId = this.globalStateService.getUserId();
            console.log('userId', userId);

            const scheduledPosts = await this.scheduledPostModel.find({ userId }).exec();
            console.log('Scheduled posts', scheduledPosts);

            const postedPosts = await this.postModel.find({ userId }).exec();
            console.log('Posted posts', postedPosts);

            const mergedPosts = [...scheduledPosts, ...postedPosts];

            return res.status(HttpStatus.OK).json(mergedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error fetching posts',
                error: error.message,
            });
        }
    }

    @Put('re-schedule-posts')
    async reschedulePost(@Body() body: { jobId: string, scheduledTime: string }, @Res() res: Response) {
        try {
            const { jobId, scheduledTime } = body;
            const newScheduledTime = new Date(scheduledTime);

            console.log("shedule data", body);

            if (newScheduledTime <= new Date()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Scheduled time must be in the future.' });
            }

            const updatedJobId = await this.bullQueueService.reschedulePost(jobId, newScheduledTime);

            return res.status(HttpStatus.OK).json({ message: 'Post successfully rescheduled.', jobId: updatedJobId });
        } catch (error) {
            console.error('Error rescheduling post:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error rescheduling post.', error: error.message });
        }
    }
}


