import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserData } from '../dto/auth.dto';
import { IAuthRepository } from '../interfaces/auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id);
    }

    async create(userData: UserData): Promise<UserDocument> {
        const createdUser = new this.userModel(userData);
        return createdUser.save();
    }

    async updateUsername(userId: string, name: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.name = name;
        return user.save();
    }

    async removeSocialProvider(userId: string, provider: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.socialAccessTokens && user.socialAccessTokens[provider]) {
            delete user.socialAccessTokens[provider];
        }
        return user.save();
    }
} 