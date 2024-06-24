import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserData } from "./dto/auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import { User, UserDocument } from "./user.schema";
import { error } from "console";
import { JwtConfigService } from "./config/jwt.config";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtSecret: JwtConfigService,
    ) { }

    //Signup
    async signup(userDto: UserData): Promise<User> {
        const { email } = userDto

        const existingUser = await this.userModel.findOne({ email })
        if (existingUser) {
            throw new ConflictException('User already exists')
        }
        const createdUser = new this.userModel(userDto);
        await createdUser.save()

        return (createdUser)
    }

    //Login
    async login(userDto: UserData): Promise<{ token: string }> {
        const { email, password } = userDto

        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new UnauthorizedException('email is not valid')
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new UnauthorizedException('Incorrect password')
        }

        const token = this.jwtSecret.generateJwtToken({ email: user.email, sub: user._id })
        return { token };
    }
}   