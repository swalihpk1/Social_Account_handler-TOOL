import { Injectable } from '@nestjs/common';
import * as OAuth from 'oauth';

@Injectable()
export class TwitterStrategy {
    private oauth: OAuth.OAuth;

    constructor() {
        this.oauth = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            'ibGbOBb59kHTTrr6DsAeE8SWD',
            'Rl3PCbhej2pNrKQiZqccLZBBePycDASp57gIc2ssc7Q4PGExLY',
            '1.0A',
            'https://backend.frostbay.online/connect/twitter/callback',
            'HMAC-SHA1'
        );
    }

    getRequestToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
                if (error) {
                    return reject(error);
                }
                resolve({ oauthToken, oauthTokenSecret });
            });
        });
    }

    getAccessToken(oauthToken: string, oauthTokenSecret: string, oauthVerifier: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.oauth.getOAuthAccessToken(
                oauthToken,
                oauthTokenSecret,
                oauthVerifier,
                (error, accessToken, accessTokenSecret, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve({ accessToken, accessTokenSecret });
                }
            );
        });
    }

    async getUserProfile(accessToken: string, accessTokenSecret: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.oauth.get(
                'https://api.twitter.com/1.1/account/verify_credentials.json',
                accessToken,
                accessTokenSecret,
                (error, data, response) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(JSON.parse(data));
                }
            );
        });
    }
}