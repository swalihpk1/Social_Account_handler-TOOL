import { Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards, Redirect } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtConfigService } from 'src/config/jwt.config';
import { UserDocument, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { UserData } from 'src/auth/dto/auth.dto';

@Controller('connect')
export class ProviderController {
    constructor(
        private readonly jwtConfigService: JwtConfigService,
        private readonly providerService: ProviderService,
        private readonly LinkedInStrategy: LinkedInStrategy,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    // ====================Facebook======================
    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin(): Promise<void> {
        console.log("Redirecting to Facebook for login");
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginCallback(@Req() req, @Res() res): Promise<any> {
        console.log("Inside facebookLoginCallback");
        const facebookUser = req.user;
        if (!facebookUser) {
            return res.status(400).json({ message: 'Facebook user data not found' });
        }

        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in session' });
        }

        try {
            const facebookData = await this.providerService.handleFacebookLoginCallback(userId, facebookUser);
            res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(facebookData))}`);
        } catch (error) {
            console.error("Error in facebookLoginCallback:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }



    // ====================Instagram======================
    @Get('instagram')
    @UseGuards(AuthGuard('instagram'))
    async instagramLogin(): Promise<void> {
        console.log("Redirecting to Instagram for login");
    }


    @Get('instagram/callback')
    @UseGuards(AuthGuard('instagram'))
    async instagramLoginCallback(@Req() req, @Res() res): Promise<any> {
        console.log("Inside instagramCallback");
        const instaUser = req.user;
        console.log("User", instaUser);
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
            const accessToken = await this.LinkedInStrategy.getAccessToken(code);
            const linkedinUser = await this.LinkedInStrategy.getUserProfile(accessToken);
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