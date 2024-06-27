import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserData } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { Request } from 'express'; // Correct import statement

@Controller('user')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() userDto: UserData, @Req() req: Request) { 
        return this.authService.login(userDto, req);
    }

    @Post('signup')
    async signup(@Body() userDto: UserData) {
        return this.authService.signup(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getProtectedRoute() {
        return { message: 'This route is protected' };
    }
}
