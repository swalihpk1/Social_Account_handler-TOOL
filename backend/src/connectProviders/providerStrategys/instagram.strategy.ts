import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InstagramStrategy {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async getAccessToken(code: string): Promise<string> {
        const tokenUrl = 'https://api.instagram.com/oauth/access_token';
        const response = await firstValueFrom(
            this.httpService.post(tokenUrl, {
                client_id: this.configService.get('INSTAGRAM_CLIENT_ID'),
                client_secret: this.configService.get('INSTAGRAM_CLIENT_SECRET'),
                grant_type: 'authorization_code',
                redirect_uri: this.configService.get('INSTAGRAM_REDIRECT_URI'),
                code,
            }),
        );
        return response.data.access_token;
    }

    async getUserProfile(accessToken: string): Promise<any> {
        accessToken = 'EAALxcib5730BO18s8z7h5IYZCODX2ZA0yZBgxVAMdXlIZB3xy6zP3SaJOYZA6ZCwuopvRAZCEZAyHEPFQy2mQEZCZCdPHBLY2L1c4tkpFlGimHTJqZCZAbd88NWxc1wfQtaONB5FffVcfXqRxYqWbbPHYjU0J1VMrZAeZCr27imhMZAzx7D7ZAuilhFdfBH9NfO9g91G9R6nu95Ui2mckt3ZB1yxXJQZDZD'
        const profileUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;
        const response = await firstValueFrom(this.httpService.get(profileUrl),);
        console.log("RES", response);
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


