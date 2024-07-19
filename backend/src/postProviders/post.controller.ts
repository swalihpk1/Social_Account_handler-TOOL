import { Controller, Get, HttpStatus, Req, Res } from "@nestjs/common";
import { PostService } from "./post.service";
import { Request, Response } from 'express';


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
}


