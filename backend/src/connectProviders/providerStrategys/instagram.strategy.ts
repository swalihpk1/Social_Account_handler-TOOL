import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class InstagramStrategy {
    private readonly logger = new Logger(InstagramStrategy.name);
    private readonly facebookAccessToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        // this.facebookAccessToken = this.configService.get<string>('FACEBOOK_ACCESS_TOKEN');
        this.facebookAccessToken = 'EAAOy6bnJZCjcBO9aaGUD23ZCWnfw5V3TTCyPUaAl45rmsJbCAfJN3jsOwj5sDyQlZBak8tZANV7eeP0O36bg2YyUizoTNmcF68czB0qUZCbZCw1L7gnO5v0R3C2pPR6nroqb7rHBStzI9cqpZBq3fDzsRNELpxVucIhtmTPF8ZBRR6jMQksYCtZBhf4lHZCs69QWid0JGlmC3f2dpnAw951XmLJB2L641RKgUZCJP0p4jBZBx4WeMED4vedJ'
    }

    async getUserPages(): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/me/accounts?access_token=${this.facebookAccessToken}`;
        this.logger.debug(`Fetching user pages with URL: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        console.log("UserPages", response);
        return response.data;
    }

    async getInstagramBusinessAccount(pageId: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${this.facebookAccessToken}`;
        this.logger.debug(`Fetching Instagram Business Account with URL: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        console.log("BusinessAcount", response);
        return response.data;
    }

    async getInstagramMedia(igUserId: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/${igUserId}/media?access_token=${this.facebookAccessToken}`;
        this.logger.debug(`Fetching Instagram Media with URL: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        return response.data;
    }

    async getInstagramUserProfile(igUserId: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/${igUserId}?fields=id,username,account_type,media_count&access_token=${this.facebookAccessToken}`;
        this.logger.debug(`Fetching Instagram User Profile with URL: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        console.log("UserProfile", response);
        return response.data;
    }
}