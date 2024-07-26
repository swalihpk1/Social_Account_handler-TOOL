import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramStrategy {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
        this.clientSecret = this.configService.get<string>('INSTAGRAM_CLIENT_SECRET');
        this.redirectUri = this.configService.get<string>('INSTAGRAM_REDIRECT_URI');
    }

    generateInstagramLoginURL(): string {
        const baseUrl = 'https://www.facebook.com/dialog/oauth';
        const params = new URLSearchParams({
            client_id: this.clientId,
            display: 'page',
            extras: JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } }),
            redirect_uri: this.redirectUri,
            response_type: 'token',
            scope: 'instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement',
        });

        return `${baseUrl}?${params.toString()}`;
    }

    async getFacebookPages(accessToken: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getInstagramBusinessAccountId(pageId: string, accessToken: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getInstagramUserDetails(instagramBusinessId: string, accessToken: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/${instagramBusinessId}?fields=username,profile_picture_url&access_token=${accessToken}`;
        const response = await firstValueFrom(this.httpService.get(url));
        return response.data;
    }
}

// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class InstagramStrategy {
//     private readonly clientId: string;
//     private readonly clientSecret: string;
//     private readonly redirectUri: string;

//     constructor(
//         private readonly httpService: HttpService,
//         private readonly configService: ConfigService,
//     ) {
//         this.clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
//         this.clientSecret = this.configService.get<string>('INSTAGRAM_CLIENT_SECRET');
//         this.redirectUri = this.configService.get<string>('INSTAGRAM_REDIRECT_URI');
//     }

//     getLoginUrl(): string {
//         const scopes = 'user_profile,user_media';
//         return `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scopes}&response_type=code`;
//     }

//     async getAccessToken(code: string): Promise<string> {
//         const url = `https://api.instagram.com/oauth/access_token`;
//         const params = {
//             client_id: this.clientId,
//             client_secret: this.clientSecret,
//             grant_type: 'authorization_code',
//             redirect_uri: this.redirectUri,
//             code,
//         };

//         const response = await firstValueFrom(this.httpService.post(url, null, { params }));
//         return response.data.access_token;
//     }

//     async getUserProfile(accessToken: string): Promise<any> {
//     const url = `https://graph.instagram.com/me`;
//     const params = {
//       fields: 'id,username,account_type,media_count',
//       access_token: accessToken,
//     };

//     const response = await firstValueFrom(this.httpService.get(url, { params }));
//     return response.data;
//   }
// }


