import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserData } from "./dto/auth.dto";
import { User } from "../schemas/user.schema";
import { JwtConfigService } from "src/config/jwt/jwt.config";
import { Request } from 'express';
import { GlobalStateService } from '../utils/global-state.service';
import { IAuthRepository } from "./interfaces/auth.repository.interface";
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IAuthRepository') private authRepository: IAuthRepository,
        private jwtSecret: JwtConfigService,
        private globalStateService: GlobalStateService
    ) { }

    async signup(userDto: UserData): Promise<User> {
        try {
            const existingUser = await this.authRepository.findByEmail(userDto.email);

            if (existingUser) {
                throw new CustomException('User already exists', 409);
            }

            return await this.authRepository.create(userDto);
        } catch (error) {
            if (error instanceof CustomException) throw error;
            throw new CustomException('Error creating user', 500);
        }
    }

    async login(userDto: UserData, req: Request): Promise<{ accessToken: string, refreshToken: string }> {
        try {
            const { email, password } = userDto;
            console.log(email, password);
            const user = await this.authRepository.findByEmail(email);

            if (!user) {
                throw new CustomException('Invalid email or password', 401);
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new CustomException('Invalid email or password', 401);
            }

            // Set session and global state
            req.session.user = { email: user.email, id: user._id };
            this.globalStateService.setUserId(user._id.toString());

            console.log('User logged in. User ID:', user._id.toString());

            const accessToken = this.jwtSecret.generateJwtToken({ email: user.email, sub: user._id });
            const refreshToken = this.jwtSecret.generateRefreshToken({ email: user.email, sub: user._id });

            return { accessToken, refreshToken };
        } catch (error) {
            if (error instanceof CustomException) throw error;
            throw new CustomException('Login failed', 500);
        }
    }


    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        const decoded = this.jwtSecret.verifyRefreshToken(refreshToken);
        if (!decoded) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const accessToken = this.jwtSecret.generateJwtToken({ email: decoded.email, sub: decoded.sub });
        return { accessToken };
    }

    async removeSocialAccount(userId: string, provider: string) {
        return this.authRepository.removeSocialProvider(userId, provider);
    }

    async updateUsername(userId: string, name: string) {
        return this.authRepository.updateUsername(userId, name);
    }
}
