import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ProviderService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async handleFacebookLoginCallback(userId: string, facebookUser: any): Promise<{ profileName: string, provider: string } | null> {
        const { user, accessToken } = facebookUser;
        const firstName = user.firstName, lastName = user.lastName;

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }

        foundUser.socialAccessTokens.set('facebook', accessToken);
        await foundUser.save();

        return {
            profileName: `${firstName || ''} ${lastName || ''}`,
            provider: 'facebook',
        };
    }
}
