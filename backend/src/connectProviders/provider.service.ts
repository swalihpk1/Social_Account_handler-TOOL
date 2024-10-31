import { Inject, Injectable } from '@nestjs/common';
import { IProviderRepository } from './interfaces/provider.repository.interface';

@Injectable()
export class ProviderService {
    constructor(
        @Inject('IProviderRepository') private providerRepository: IProviderRepository,
    ) { }

    async handleFacebookLoginCallback(userId: string, facebookUser: any, accessToken: string): Promise<{ profileName: string, profilePicture: string } | null> {
        const { userName, userImage } = facebookUser;

        await this.providerRepository.updateSocialAccessToken(userId, 'facebook', accessToken);

        return {
            profileName: userName,
            profilePicture: userImage,
        };
    }

    async handleInstagramLoginCallback(userId: string, instagramUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const [user] = instagramUser;
        const { username, profile_picture_url } = user;

        await this.providerRepository.updateSocialAccessToken(userId, 'instagram', accessToken);

        return {
            profileName: username,
            profilePicture: profile_picture_url,
            provider: 'instagram',
        };
    }

    async handleLinkedInLoginCallback(userId: string, linkedinUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const { name, picture } = linkedinUser;

        await this.providerRepository.updateSocialAccessToken(userId, 'linkedin', accessToken);

        return {
            profileName: name,
            profilePicture: picture,
            provider: 'linkedin'
        }
    }

    async handleTwitterLoginCallback(userId: string, twitterUser: any, accessToken: string): Promise<{ profileName: string, provider: string, profilePicture: string } | null> {
        const { name, profile_image_url } = twitterUser;

        await this.providerRepository.updateSocialAccessToken(userId, 'twitter', accessToken);

        return {
            profileName: name,
            profilePicture: profile_image_url,
            provider: 'twitter'
        }
    }
}
