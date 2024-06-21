import { ConflictException, Injectable } from "@nestjs/common";
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
    async signup(user: UserData): Promise<User> {
        const { email } = user

        const existingUser = await this.userModel.findOne({ email })
        if (existingUser) {
            throw new ConflictException('User already exists')
        }
        const createdUser = new this.userModel(user);
        await createdUser.save()

        const token = this.jwtSecret.generateJwtToken({ email: user.email, sub: createdUser._id })
        console.log("TOKEN : ",token);
        return (createdUser)
    }

    //Login
    async login(user: UserData) {


        return { message: "Login completed" }

    }
} 