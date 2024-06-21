import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserData } from "./dto/auth.dto";


@Controller()
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
}
