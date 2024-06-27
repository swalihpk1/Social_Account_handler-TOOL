import { Module } from "@nestjs/common";
import { JwtConfigService } from "./jwt.config";

@Module({
    providers: [JwtConfigService],
    exports: [JwtConfigService]
})
export class JwtConfigModule { }