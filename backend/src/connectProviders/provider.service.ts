import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ProviderService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async handleFacebookLoginCallback(userId: string, facebookUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const { name } = facebookUser;
        const profilePicture = facebookUser.picture.data.url

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }

        foundUser.socialAccessTokens.set('facebook', accessToken);
        await foundUser.save();

        return {
            profileName: name,
            profilePicture,
            provider: 'facebook',

        };
    }

    async handleLinkedInLoginCallback(userId: string, linkedinUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const { name, picture } = linkedinUser;

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }
        foundUser.socialAccessTokens.set('linkedin', accessToken);
        await foundUser.save();

        return {
            profileName: name,
            profilePicture: picture,
            provider: 'linkedin'
        }

    }

    async handleTwitterLoginCallback(userId: string, accessToken: string): Promise<void> {

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }

        foundUser.socialAccessTokens.set('twitter', accessToken);
        await foundUser.save();
    }
}
