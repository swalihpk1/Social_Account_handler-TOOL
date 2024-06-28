import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtConfigService } from 'src/config/jwt.config';
import { UserDocument, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';


@Controller('connect')
export class ProviderController {
    constructor(
        private readonly jwtConfigService: JwtConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

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
        console.log(facebookUser);
        if (!facebookUser) {
            return res.status(400).json({ message: 'Facebook user data not found' });
        }

        const { user, accessToken } = facebookUser;

        const firstName = user.firstName, lastName = user.lastName
        console.log(firstName, lastName);

        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID not found in session' });
        }

        try {
            // Retrieve the user from MongoDB
            let user = await this.userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user with Facebook details
            user.socialAccessTokens.set('facebook', accessToken);
            // user.name = `${firstName} ${lastName}` || user.name;
            console.log(user);
            await user.save();

            // Prepare user data to send to frontend
            const facebookData = {
                profileName: `${firstName || ''} ${lastName || ''}`,
                provider:'facebook'
            };


            // Redirect to the frontend with user data
            res.redirect(`http://localhost:3000/connect?user=${encodeURIComponent(JSON.stringify(facebookData))}`);
        } catch (error) {
            console.error("Error in facebookLoginCallback:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
