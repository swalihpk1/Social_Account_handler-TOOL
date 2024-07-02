// auth.controller.ts
import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData } from './dto/auth.dto';
import { Request, Response } from 'express';

@Controller('user')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() userDto: UserData, @Req() req: Request, @Res() res: Response) {
        const tokens = await this.authService.login(userDto, req);
        res.json(tokens);
    }

    @Post('signup')
    async signup(@Body() userDto: UserData) {
        return this.authService.signup(userDto);
    }

    @Post('refresh-token')
    @HttpCode(200)
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const newAccessToken = await this.authService.refreshToken(refreshToken);
        return newAccessToken;
    }
}
