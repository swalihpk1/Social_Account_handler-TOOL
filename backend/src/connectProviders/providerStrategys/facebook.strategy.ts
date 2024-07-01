import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: 'http://localhost:3001/connect/facebook/callback',
            profileFields: ['id', 'email', 'name']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, cb: Function) {
        const { id, emails, name } = profile;
        const user = {
            facebookId: id,
            email: emails && emails.length > 0 ? emails[0].value : null,
            firstName: name.givenName,
            lastName: name.familyName,
        };
        const payload = {
            user,
            accessToken,
        }
        cb(null, payload);
    }
    
}
