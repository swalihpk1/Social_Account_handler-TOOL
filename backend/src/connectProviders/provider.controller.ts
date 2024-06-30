import { Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards, Redirect } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtConfigService } from 'src/config/jwt.config';
import { UserDocument, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { LinkedinOauthService } from './ linkedin-oauth.service';

@Controller('connect')
export class ProviderController {
    constructor(
        private readonly jwtConfigService: JwtConfigService,
        private readonly providerService: ProviderService,
        private readonly linkedInOAuthService: LinkedinOauthService,
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
        // Further logic to handle the callback data
    }




    // ====================LinkedIn======================
    @Get('linkedin')
    @Redirect()
    redirectToLinkedin() {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
        const scope = 'openid profile email';
        const state = '12345'; // You should generate a secure random state

        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        return { url: linkedinAuthUrl };
    }

    @Get('linkedin/callback')
    async linkedinCallback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res() res: Response) {
        if (!code) {
            throw new UnauthorizedException('No code provided');
        }

        try {
            const accessToken = await this.linkedInOAuthService.getAccessToken(code);
            const userProfile = await this.linkedInOAuthService.getUserProfile(accessToken);

            console.log("UserPrfofile", userProfile);
            // Handle user login or registration here using userProfile data
            // Example:
            let user = await this.userModel.findOne({ linkedinId: userProfile.sub });

            // if (!user) {
            //     user = new this.userModel({
            //         linkedinId: userProfile.sub,
            //         name: userProfile.name,
            //         email: userProfile.email,
            //         profilePicture: userProfile.picture,
            //     });
            //     await user.save();
            // }

            // // Create a session or JWT token for the authenticated user
            // res.cookie('jwt', jwtToken, { httpOnly: true });

            // // Redirect to the frontend with the user's profile information
            // res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(user))}`);
        } catch (error) {
            console.error("Error in LinkedIn Callback:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }




    // @Get('linkedin')
    // @UseGuards(AuthGuard('linkedin'))
    // async linkedinLogin(): Promise<void> {
    //     console.log("Redirecting to LinkedIn for login");
    // }

    // @Get('linkedin/callback')
    // @UseGuards(AuthGuard('linkedin'))
    // async linkedinLoginCallback(@Req() req: Request, @Res() res: Response): Promise<any> {
    //     console.log("Inside LinkedInCallback");
    //     // const linkedinUser = req.user;

    //     // if (!linkedinUser) {
    //     //     return res.status(400).json({ message: 'LinkedIn user data not found' });
    //     // }

    //     // const userId = req.session?.user?.id;
    //     // if (!userId) {
    //     //     return res.status(400).json({ message: 'User ID not found in session' });
    //     // }

    //     // try {
    //     //     const linkedInData = await this.providerService.handleLinkedInLoginCallback(userId, linkedinUser);
    //     //     res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(linkedInData))}`);
    //     // } catch (error) {
    //     //     console.error("Error in linkedinLoginCallback:", error);
    //     //     return res.status(500).json({ message: 'Internal server error' });
    //     // }
    // }


    // ----------Passport.strategy--------
    // @Get('linkedin')
    // @UseGuards(AuthGuard('linkedin'))
    // async linkedinLogin(): Promise<void> {
    //     console.log("Redirecting to LinkedIn for login");
    // }

    // @Get('linkedin/callback')
    // @UseGuards(AuthGuard('linkedin'))
    // async linkedinLoginCallback(@Req() req, @Res() res): Promise<any> {
    //     console.log("Inside LinkedInCallback");
    //     const linkedinUser = req.user;
    //     console.log("User", linkedinUser);
    // }
}