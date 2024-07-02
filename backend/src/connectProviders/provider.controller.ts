import { Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards, Redirect, Logger, Session } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtConfigService } from 'src/config/jwt.config';
import { UserDocument, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { UserData } from 'src/auth/dto/auth.dto';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';

@Controller('connect')
export class ProviderController {
    private readonly logger = new Logger(ProviderController.name);
    constructor(
        private readonly providerService: ProviderService,
        private readonly linkedInStrategy: LinkedInStrategy,
        private readonly instagramStretegy: InstagramStrategy,
        private readonly facebookStrategy: FacebookStrategy,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    // ====================Facebook======================

    @Get('facebook')
    @Redirect()
    login() {
        const facebookLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email`;
        return { url: facebookLoginUrl };
    }

    @Get('facebook/callback')
    async facebookCallback(@Query('code') code: string, @Req() req, @Res() res): Promise<any> {
        if (code) {
            try {
                const data = await this.facebookStrategy.getAccessToken(code);
                const accessToken = data.access_token

                if (!accessToken) return res.status(400).json({ message: 'Facebook accessToken not found' });

                const facebookProfile = await this.facebookStrategy.getUserData(data.access_token);
                const userId = req.session?.user?.id;

                console.log('facebok', facebookProfile);

                if (!userId) {
                    return res.status(400).json({ message: 'User ID not found in session' });
                }

                if (!facebookProfile) return res.status(400).json({ message: 'Facebook userData not found' });

                const facebookData = await this.providerService.handleFacebookLoginCallback(userId, facebookProfile, accessToken);
                res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(facebookData))}`);

            } catch (error) {
                console.error('Error during Facebook callback', error);
            }
        } else {
            return res.status(400).send('Authorization code is missing');
        }
    }


    // ====================Instagram======================

    @Get('facebook/pages')
    async getUserPages() {
        this.logger.debug('Fetching user pages');
        return this.instagramStretegy.getUserPages();
    }

    @Get('facebook/instagram-account')
    async getInstagramBusinessAccount(@Query('pageId') pageId: string) {
        this.logger.debug(`Fetching Instagram Business Account for Page ID: ${pageId}`);
        return this.instagramStretegy.getInstagramBusinessAccount(pageId);
    }

    @Get('instagram/media')
    async getInstagramMedia(@Query('igUserId') igUserId: string) {
        this.logger.debug(`Fetching Instagram Media for IG User ID: ${igUserId}`);
        return this.instagramStretegy.getInstagramMedia(igUserId);
    }

    @Get('instagram/profile')
    async getInstagramUserProfile(@Query('igUserId') igUserId: string) {
        this.logger.debug(`Fetching Instagram User Profile for IG User ID: ${igUserId}`);
        return this.instagramStretegy.getInstagramUserProfile(igUserId);
    }







    // ====================LinkedIn======================
    @Get('linkedin')
    @Redirect()
    redirectToLinkedin() {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
        const scope = 'openid profile email';
        const state = '12345';

        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        return { url: linkedinAuthUrl };
    }

    @Get('linkedin/callback')
    async linkedinCallback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res() res: Response) {
        if (!code) {
            throw new UnauthorizedException('No code provided');
        }

        try {
            const accessToken = await this.linkedInStrategy.getAccessToken(code);
            const linkedinUser = await this.linkedInStrategy.getUserProfile(accessToken);
            // console.log(linkedinUser);þ

            if (!linkedinUser || !accessToken) {
                return res.status(400).json({
                    message: 'LinkedIn user data or accessToken not found'
                });
            }

            const userId = req.session?.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }

            const linkedInData = await this.providerService.handleLinkedInLoginCallback(userId, linkedinUser, accessToken);
            console.log(linkedInData);

            res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(linkedInData))}`);
        } catch (error) {
            console.error("Error in LinkedIn Callback:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }



    // ==================== Twitter-X ======================
    @Get('twitter')
    @UseGuards(AuthGuard('twitter'))
    async twitterLogin(): Promise<void> {
        console.log("Redirecting to twitter for login");
    }


    @Get('twitter/callback')
    @UseGuards(AuthGuard('twitter'))
    async twitterLoginCallback(@Req() req, @Res() res): Promise<any> {
        console.log("Inside twitterLoginCallback");
        try {
            const twitterUser = req.user;
            const accessToken = twitterUser.accessToken;

            console.log("user", twitterUser);
            console.log("accessToken", accessToken);

            if (!twitterUser || !accessToken) {
                return res.status(400).json({
                    message: 'twitterUser data or accessToken not found'
                });
            }

            const userId = req.session?.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }


            await this.providerService.handleTwitterLoginCallback(userId, accessToken)

            res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(twitterUser.user))}`);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}