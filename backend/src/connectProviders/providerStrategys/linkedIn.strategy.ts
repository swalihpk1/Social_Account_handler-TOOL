import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ProviderService } from '../provider.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
    private readonly clientID = '868u1vas0au9xq';
    private readonly clientSecret = 'WPL_AP0.dc96DrB5KgrBocon.ODE3NDk3NDIw';
    private readonly redirectURI = 'http://localhost:3001/connect/linkedin/callback';
    private readonly tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
    private readonly userinfoEndpoint = 'https://api.linkedin.com/v2/me';
    private readonly scopes = ['openid', 'profile', 'email']; // Example scopes

    constructor(
        private readonly providerService: ProviderService,
        private readonly httpService: HttpService,
    ) {
        super();

        this.clientID = '868u1vas0au9xq';
        this.clientSecret = 'WPL_AP0.dc96DrB5KgrBocon.ODE3NDk3NDIw';
        this.redirectURI = 'http://localhost:3001/connect/linkedin/callback';
        this.tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
        this.userinfoEndpoint = 'https://api.linkedin.com/v2/me';
        this.scopes = ['openid', 'profile', 'email']
    }

    async validate(req: any, done: Function): Promise<any> {
        console.log("Inside LinkedIn validate function");
        console.log("Queary", req.query);
        const { code } = req.query;

        if (!code) {
            return done(null, false);
        }

        try {
            const tokenResponse = await this.httpService.post(this.tokenEndpoint, null, {
                params: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: this.redirectURI,
                    client_id: this.clientID,
                    client_secret: this.clientSecret,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).toPromise();

            const accessToken = tokenResponse.data.access_token;
            console.log('Access Token:', accessToken);

            const userResponse = await this.httpService.get(this.userinfoEndpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).toPromise();

            const profile = userResponse.data;
            done(null, { profile, accessToken });
        } catch (error) {
            console.error("Error in LinkedIn validate:", error);
            done(error, null);
        }
    }
}
