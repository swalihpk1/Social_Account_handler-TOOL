import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-facebook';
import { ProviderService } from "./provider.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly providerService: ProviderService) {
        super({
            clientID: '7228582190575203',
            clientSecret: 'c05fc31eb268748d1e71244315b70133',
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
