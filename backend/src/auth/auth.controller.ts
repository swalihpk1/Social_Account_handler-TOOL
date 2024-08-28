import { Controller, Post, Body, Req, Res, HttpCode, Delete, Patch } from '@nestjs/common';
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

    @Delete('remove-social-account')
    @HttpCode(200)
    async removeSocialAccount(@Req() req, @Body('provider') provider: string) {
        const userId = req.session?.user?.id;
        const user = await this.authService.removeSocialAccount(userId, provider)
        return user;
    }

    @Patch('update-username')
    @HttpCode(200)
    async updateUsername(@Req() req, @Body('name') name: string) {
        const userId = req.session?.user?.id;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const updatedUser = await this.authService.updateUsername(userId, name);

        return updatedUser;
    }
}
