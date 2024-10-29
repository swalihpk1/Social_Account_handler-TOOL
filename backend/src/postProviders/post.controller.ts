import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostService } from "./post.service";
import { Request, Response } from 'express';




@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService


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
    @UseInterceptors(FileInterceptor('image'))
    async createPost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
        try {
            console.log('body', body);
            await this.postService.handleCreatePost(file, body);
            return res.status(HttpStatus.CREATED).json({ message: 'Post created successfully on all platforms!' });
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
        return this.postService.fetchHashtags(keyword);
    }


    @Post('schedule')
    @UseInterceptors(FileInterceptor('image'))
    async schedulePost(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Res() res: Response) {
        try {
            await this.postService.schedulePost(file, body);

            return res.status(HttpStatus.CREATED).json({ message: 'Post successfully scheduled.' });
        } catch (error) {
            console.error(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while scheduling the post.', error: error.message });
        }
    }


    @Get('fetch-all-posts')
    async getScheduledPosts(@Res() res: Response) {
        try {
            const mergedPosts = await this.postService.getAllPosts();

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

            const result = await this.postService.reschedulePost(jobId, scheduledTime);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.error('Error rescheduling post:', error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error rescheduling post.', error: error.message });
        }
    }

    @Delete('delete-schedule-post')
    async deleteScheduledPost(@Body() body: { jobId: string }) {
        const { jobId } = body;
        try {
            const result = await this.postService.deleteScheduledPost(jobId);
            return result;
        } catch (error) {
            console.error('Error deleting scheduled post:', error.message);
            throw new HttpException(
                'Could not delete the scheduled post',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put('edit/:jobId')
    @UseInterceptors(FileInterceptor('image'))
    async updateScheduledPostContent(
        @Param('jobId') jobId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateData: { platform: string; content: string; imageUrl?: string }
    ) {

        const updatedPost = await this.postService.updateSchedulePost(jobId, updateData, file);
        return updatedPost;
    }


}

