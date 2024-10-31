import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/user.schema";
import { CustomConfigModule } from "src/config/customConfig.module";
import { GlobalStateModule } from "src/utils/global-state.module";
import { AuthRepository } from "./repositories/auth.repository";

@Module({
    imports: [
        CustomConfigModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        GlobalStateModule
    ],
    providers: [
        AuthService,
        AuthRepository,
        {
            provide: 'IAuthRepository',
            useClass: AuthRepository
        }
    ],
    controllers: [AuthController]
})

export class AuthModule { }