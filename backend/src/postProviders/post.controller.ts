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


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly globalStateService: GlobalStateService,
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

}


