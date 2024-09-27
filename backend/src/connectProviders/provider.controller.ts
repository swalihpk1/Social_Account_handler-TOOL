import { Controller, Get, Query, Req, Res, UnauthorizedException, UseGuards, Redirect, Session } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderService } from './provider.service';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';
import { GlobalStateService } from 'src/utils/global-state.service';
import { TwitterStrategy } from './providerStrategys/twitter.strategy';


@Controller('connect')
export class ProviderController {
    constructor(
        private readonly providerService: ProviderService,
        private readonly globalStateService: GlobalStateService,
        private readonly linkedInStrategy: LinkedInStrategy,
        private readonly instagramStrategy: InstagramStrategy,
        private readonly facebookStrategy: FacebookStrategy,
        private readonly twitterStrategy: TwitterStrategy,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    // ====================Facebook======================

    @Get('facebook')
    @Redirect()
    login() {
        const facebookLoginUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&response_type=code&scope=email,public_profile,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,pages_manage_posts`;
        return { url: facebookLoginUrl };
    }

    @Get('facebook/callback')
    async facebookCallback(@Query('code') code: string, @Req() req, @Res() res): Promise<any> {
        if (code) {
            try {
                const data = await this.facebookStrategy.getAccessToken(code);
                let accessToken = data.access_token;
                console.log('Access Token:', accessToken);

                if (!accessToken) {
                    return res.status(400).json({ message: 'Facebook accessToken not found' });
                }

                const facebookProfile = await this.facebookStrategy.getUserData(accessToken);
                const userId = this.globalStateService.getUserId();
                console.log('User ID:', userId);

                if (!userId) {
                    return res.status(400).json({ message: 'User ID not found in session' });
                }

                if (!facebookProfile) {
                    return res.status(400).json({ message: 'Facebook userData not found' });
                }

                const userPages = await this.facebookStrategy.getUserPages(accessToken);
                if (!userPages) {
                    return res.status(400).json({ message: 'User pages not found' });
                }

                accessToken = userPages[0].pageToken;

                const userProfile = await this.providerService.handleFacebookLoginCallback(userId, facebookProfile, accessToken);
                const responseData = {
                    userProfile: {
                        profileName: userProfile.profileName,
                        profilePicture: userProfile.profilePicture,
                        provider: 'facebook'
                    },
                    userPages: userPages.map(page => ({
                        pageName: page.pageName,
                        pageImage: page.pageImage,
                    }))
                };

                const redirectUrl = `http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(responseData))}`;
                res.redirect(redirectUrl);

            } catch (error) {
                console.error('Error during Facebook callback', error);
                return res.status(500).send('Internal Server Error');
            }
        } else {
            return res.status(400).send('Authorization code is missing');
        }
    }




    // ====================Instagram======================
    @Get('instagram')
    instagramLogin(@Res() res: Response) {
        const instagramLoginUrl = this.instagramStrategy.generateInstagramLoginURL();
        res.redirect(instagramLoginUrl);
    }

    @Get('instagram/callback')
    async instagramCallback(@Req() req: Request, @Res() res: Response) {
        const redirectUrl = 'http://localhost:3000/connect/instagram/callback';
        res.redirect(redirectUrl);
    }

    @Get('instagram/getUser')
    async instagramGetUser(@Req() req: Request, @Res() res: Response) {
        const accessToken = req.query.access_token as string;

        if (!accessToken) {
            return res.status(400).send('Access token is missing');
        }

        try {
            const pages = await this.instagramStrategy.getFacebookPages(accessToken);

            const instagramProfile = await Promise.all(
                pages.data?.map(async (page) => {
                    const instagramBusinessAccount = await this.instagramStrategy.getInstagramBusinessAccountId(page.id, accessToken);
                    if (instagramBusinessAccount?.instagram_business_account) {
                        return await this.instagramStrategy.getInstagramUserDetails(
                            instagramBusinessAccount.instagram_business_account.id,
                            accessToken
                        );
                    }
                    return null;
                }) ?? []
            );

            const userId = this.globalStateService.getUserId();
            console.log("userId", userId);

            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }

            const instagramData = await this.providerService.handleInstagramLoginCallback(userId, instagramProfile, accessToken);
            console.log("insta", instagramData);

            res.json(instagramData)

        } catch (error) {
            console.error('Error during Instagram callback', error);
            return res.status(500).send('Internal server error');
        }
    }




    // ====================LinkedIn======================
    @Get('linkedin')
    @Redirect()
    redirectToLinkedin() {
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
        const scope = 'openid profile email w_member_social';
        const state = '12345';

        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        return { url: linkedinAuthUrl };
    }

    @Get('linkedin/callback')
    async linkedinCallback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res() res: Response) {
        console.log("VAnn");
        if (!code) {
            throw new UnauthorizedException('No code provided');
        }

        try {
            const accessToken = await this.linkedInStrategy.getAccessToken(code);
            const linkedinUser = await this.linkedInStrategy.getUserProfile(accessToken);
            console.log("ACCESS", accessToken);
            if (!linkedinUser || !accessToken) {
                return res.status(400).json({
                    message: 'LinkedIn user data or accessToken not found'
                });
            }

            const userId = req.session?.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }
            console.log('LinkedIn', linkedinUser);
            const linkedInData = await this.providerService.handleLinkedInLoginCallback(userId, linkedinUser, accessToken);

            res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(linkedInData))}`);
        } catch (error) {
            console.error("Error in LinkedIn Callback:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // ==================== Twitter-X ======================
    @Get('twitter')
    async twitterLogin(@Query('redirectUri') redirectUri: string, @Req() req, @Res() res): Promise<void> {
        try {
            req.session.redirectUri = redirectUri;

            const { oauthToken } = await this.twitterStrategy.getRequestToken();
            res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
        } catch (error) {
            res.status(500).json({ message: 'Failed to initiate Twitter login' });
        }
    }



    @Get('twitter/callback')
    async twitterLoginCallback(
        @Query('oauth_token') oauthToken: string,
        @Query('oauth_verifier') oauthVerifier: string,
        @Req() req,
        @Res() res,
        @Session() session
    ): Promise<any> {
        try {
            const { accessToken, accessTokenSecret } = await this.twitterStrategy.getAccessToken(
                oauthToken,
                req.session.oauthTokenSecret,
                oauthVerifier
            );

            const twitterUser = await this.twitterStrategy.getUserProfile(accessToken, accessTokenSecret);
            if (!twitterUser) {
                return res.status(400).json({ message: 'Twitter user data not found' });
            }

            const userId = session?.user?.id;
            if (!userId) {
                return res.status(400).json({ message: 'User ID not found in session' });
            }

            const twitterData = await this.providerService.handleTwitterLoginCallback(userId, twitterUser, accessToken);

            const redirectPath = req.session.redirectUri ? `/${req.session.redirectUri}` : '/connect';
            console.log("Redirect", redirectPath);
            res.redirect(`http://localhost:3000${redirectPath}?user=${encodeURIComponent(JSON.stringify(twitterData))}`);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}



