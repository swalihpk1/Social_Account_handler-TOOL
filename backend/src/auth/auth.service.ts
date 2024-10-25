import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserData } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { User, UserDocument } from "../schemas/user.schema";
import { JwtConfigService } from "src/config/jwt/jwt.config";
import { Request } from 'express';
import { GlobalStateService } from '../utils/global-state.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtSecret: JwtConfigService,
        private globalStateService: GlobalStateService
    ) { }

    async signup(userDto: UserData): Promise<User> {
        const { email } = userDto;
        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const createdUser = new this.userModel(userDto);
        await createdUser.save();
        return createdUser;
    }

    async login(userDto: UserData, req: Request): Promise<{ accessToken: string, refreshToken: string }> {
        const { email, password } = userDto;
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Email is not valid');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password');
        }

        req.session.user = { email: user.email, id: user._id };
        console.log('Session data:', req.session);

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
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.socialAccessTokens && user.socialAccessTokens[provider]) {
            delete user.socialAccessTokens[provider];
        }

        await user.save();
        return user;
    }

    async updateUsername(userId: string, name: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.name = name;
        await user.save();
        return user;
    }
}
