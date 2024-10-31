import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { IProviderRepository } from '../interfaces/provider.repository.interface';

@Injectable()
export class ProviderRepository implements IProviderRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findUserById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }

    async updateSocialAccessToken(userId: string, provider: string, accessToken: string): Promise<UserDocument> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.socialAccessTokens.set(provider, accessToken);
        return user.save();
    }

    async removeSocialAccessToken(userId: string, provider: string): Promise<UserDocument> {
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