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
        const facebookUser = req.user;
        const { facebookId, firstName, lastName, accessToken } = facebookUser;
        console.log(facebookUser);


        const userId = req.session.user
        console.log(userId);



        // // Update user with Facebook details
        // user.socialAccounts = user.socialAccounts || {};
        // user.socialAccounts.facebookId = facebookId;
        // user.socialAccounts.facebook = accessToken;
        // user.name = user.name || `${firstName} ${lastName}`;

        // await user.save();

        // Redirect to the frontend with the updated token
        // res.redirect(`http://localhost:3000/connect?token=${token}`);
    }
}
