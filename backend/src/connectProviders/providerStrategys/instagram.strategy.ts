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
            client_id: '828422535901053',
            display: 'page',
            extras: JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } }),
            redirect_uri: 'https://backend.frostbay.online/connect/instagram/callback',
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



