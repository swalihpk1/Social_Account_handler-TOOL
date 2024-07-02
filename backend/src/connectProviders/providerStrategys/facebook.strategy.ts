import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FacebookStrategy {
    private readonly logger = new Logger(FacebookStrategy.name);

    constructor(private readonly httpService: HttpService) { }

    async getAccessToken(code: string): Promise<any> {
        const url = `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUserData(accessToken: string): Promise<any> {
        const url = `https://graph.facebook.com/v12.0/me?fields=id,name,email,picture&access_token=${accessToken}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            this.logger.error('Error fetching user data:', error.response?.data || error.message);
            throw error;
        }
    }
}
