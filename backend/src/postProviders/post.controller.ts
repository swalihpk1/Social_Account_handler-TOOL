import { Body, Controller, Get, HttpStatus, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostService } from "./post.service";
import { Request, Response } from 'express';
import { CreatePostDto } from "./dto/createPost.dto";


@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

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
    async createPost(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Res() res: Response
    ) {
        try {
            console.log("File received:", file);
            console.log("Body received:", body); 

            const content = JSON.parse(body.content);
            const createPostDto = {
                content,
                image: file ? file.path : null,
            };

            console.log('Controller received data:', createPostDto);
            const newPost = await this.postService.createPost(createPostDto);
            return res.status(HttpStatus.CREATED).json(newPost);
        } catch (error) {
            console.error('Error creating post:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

}


