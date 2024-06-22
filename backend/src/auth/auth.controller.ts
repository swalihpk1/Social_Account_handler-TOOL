import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserData } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";


@Controller('api/user')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() user: UserData) {
        return this.authService.signup(user)
    }

    @Post('login')
    async login(@Body() user: UserData) {
        return this.authService.login(user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getProtectedRoute() {
        return { message: 'This route is protected' };
    }
}
