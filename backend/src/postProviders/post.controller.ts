import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
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


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService
        , @InjectModel(User.name) private userModel: Model<UserDocument>
        , @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>
        , private readonly globalStateService: GlobalStateService
        , private readonly bullQueueService: BullQueueService

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

            
        const results = await this.postService.createPost(
            content,
            file,
            socialAccessTokens
        );

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
            console.log("schedulePost endpoint hit with body:", body);

            const userId = this.globalStateService.getUserId();
            const foundUser = await this.userModel.findById(userId);

            if (!foundUser) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found.',
                });
            }

            const socialAccessTokens = foundUser.socialAccessTokens;


            // Parse the content from the request body
            const content = JSON.parse(body.content);

            // Convert the scheduled time string to a Date object
            const scheduledTime = new Date(body.scheduledTime);
            console.log('scheduledTime:', scheduledTime);

            // Upload image to S3 if file is present
            let imageUrl = null;
            if (file) {
                imageUrl = await this.postService.uploadImageToS3(file);
                console.log("Image uploaded to S3:", imageUrl);
            }

            // Prepare job data
            const jobData = {
                userId,
                content,
                fileUrl: imageUrl,
                socialAccessTokens,
                scheduledTime,
            };

            console.log("Job Data:", jobData);

            // Add the job to the queue
            await this.bullQueueService.addPostToQueue(jobData);

            // Store scheduled post in the database
            const scheduledPost = new this.scheduledPostModel({
                content,
                platforms: Object.keys(socialAccessTokens).map(platform => ({
                    platform,
                })),
                image: imageUrl,
                scheduledTime,
                status: 'scheduled',
            });

            await scheduledPost.save();
            console.log("Scheduled post saved to database!");

            return res.status(HttpStatus.CREATED).json({
                message: 'Post successfully scheduled.',
            });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error occurred while scheduling the post.',
                error: error.message,
            });
        }
    }
}


