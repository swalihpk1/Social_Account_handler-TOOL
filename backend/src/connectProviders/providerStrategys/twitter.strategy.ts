import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/connect/twitter/callback",
            includeEmail: true,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
        const { displayName, photos, emails } = profile;
        const user = {
            profileName: displayName,
            profilePicture: photos[0].value,
            provider: 'twitter'
        };
        const payload = {
            user,
            accessToken,
        };
        done(null, payload);
    }
}
