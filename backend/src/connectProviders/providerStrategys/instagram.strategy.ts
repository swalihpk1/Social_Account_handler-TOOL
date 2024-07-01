import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-instagram';
import { ProviderService } from "../provider.service";

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
    constructor() {
        super({
            clientID: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/connect/instagram/callback",
            scope: ['user_profile', 'user_media'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
        console.log("Validation function called");
        try {
            console.log("Profile:", profile);
            console.log("Access Token:", accessToken);
            done(null, profile);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            done(error, null);
        }
    }
}
