import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/user.schema";
import { customConfigModule } from "src/config/config.module";
import { GlobalStateModule } from "src/utils/global-state.module";

@Module({
    imports: [
        customConfigModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        GlobalStateModule
    ],
    providers: [AuthService],
    controllers: [AuthController]
})

export class AuthModule { }