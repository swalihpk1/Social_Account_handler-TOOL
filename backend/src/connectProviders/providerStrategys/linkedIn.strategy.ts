import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LinkedInStrategy {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) {
        this.clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
        this.clientSecret = this.configService.get<string>('LINKEDIN_CLIENT_SECRET');
        this.redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
    }

    async getAccessToken(code: string): Promise<string> {
        const url = 'https://www.linkedin.com/oauth/v2/accessToken';
        const params = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        };

        const response = await firstValueFrom(this.httpService.post(url, null, { params }));
        return response.data.access_token;
    }

    async getUserProfile(accessToken: string) {
        const url = 'https://api.linkedin.com/v2/userinfo';
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await firstValueFrom(this.httpService.get(url, { headers }));
        return response.data;
    }

    verifyIdToken(idToken: string): any {
        const { JwksClient } = require('jwks-rsa');
        const client = new JwksClient({
            jwksUri: 'https://www.linkedin.com/oauth/openid/jwks',
        });

        const getKey = (header, callback) => {
            client.getSigningKey(header.kid,
                (err, key) => {
                const signingKey = key.getPublicKey();
                callback(null, signingKey);
            });
        };

        return new Promise((resolve, reject) => {
            jwt.verify(idToken, getKey, { issuer: 'https://www.linkedin.com' }, (err, decoded) => {
                if (err) {
                    return reject(new UnauthorizedException('Invalid ID Token'));
                }
                resolve(decoded);
            });
        });
    }
}
