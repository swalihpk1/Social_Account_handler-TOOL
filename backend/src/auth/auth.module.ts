import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { JwtConfigModule } from "./config/jwt.module";

@Module({
    imports: [
        JwtConfigModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [AuthService],
    controllers: [AuthController]
})

export class AuthModule { }