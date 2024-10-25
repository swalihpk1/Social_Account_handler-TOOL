import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class ProviderService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async handleFacebookLoginCallback(userId: string, facebookUser: any, accessToken: string): Promise<{ profileName: string, profilePicture: string } | null> {
        const { userName, userImage } = facebookUser;


        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }
        console.log("ACCESS", accessToken);
        foundUser.socialAccessTokens.set('facebook', accessToken);
        await foundUser.save();

        return {
            profileName: userName,
            profilePicture: userImage,
        };
    }


    async handleInstagramLoginCallback(userId: string, instagramUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const [user] = instagramUser;
        const { username, profile_picture_url } = user;

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }

        foundUser.socialAccessTokens.set('instagram', accessToken);
        await foundUser.save();

        return {
            profileName: username,
            profilePicture: profile_picture_url,
            provider: 'instagram',

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


    async handleTwitterLoginCallback(userId: string, twitterUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const { name, profile_image_url } = twitterUser;

        let foundUser = await this.userModel.findById(userId);
        if (!foundUser) {
            throw new Error('User not found');
        }
        foundUser.socialAccessTokens.set('twitter', accessToken);
        await foundUser.save();

        return {
            profileName: name,
            profilePicture: profile_image_url,
            provider: 'twitter'
        }
    }





}
