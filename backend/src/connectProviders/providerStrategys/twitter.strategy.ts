import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: 'Bv3oDuqMrH4oFgMW4KtBLhATk',
            consumerSecret: 'UKpR7WO8f245oo89YCUBe5QP0zvium8KrYBwMbNAa9lqNgZ8Yb',
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
