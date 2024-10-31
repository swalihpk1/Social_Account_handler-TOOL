import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserData } from "./dto/auth.dto";
import { User } from "../schemas/user.schema";
import { JwtConfigService } from "src/config/jwt/jwt.config";
import { Request } from 'express';
import { GlobalStateService } from '../utils/global-state.service';
import { IAuthRepository } from "./interfaces/auth.repository.interface";

@Injectable()
export class AuthService {
    constructor(
        @Inject('IAuthRepository') private authRepository: IAuthRepository,
        private jwtSecret: JwtConfigService,
        private globalStateService: GlobalStateService
    ) { }

    async signup(userDto: UserData): Promise<User> {
        const existingUser = await this.authRepository.findByEmail(userDto.email);

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        return this.authRepository.create(userDto);
    }

    async login(userDto: UserData, req: Request): Promise<{ accessToken: string, refreshToken: string }> {
        const { email, password } = userDto;
        const user = await this.authRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Email is not valid');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password');
        }

        req.session.user = { email: user.email, id: user._id };
        this.globalStateService.setUserId(user._id.toString());

        const accessToken = this.jwtSecret.generateJwtToken({ email: user.email, sub: user._id });
        const refreshToken = this.jwtSecret.generateRefreshToken({ email: user.email, sub: user._id });

        return { accessToken, refreshToken };
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
