import { Module } from "@nestjs/common";
import { JwtConfigService } from "./jwt/jwt.config";
import { AwsS3Service } from "./aws/aws-s3.service";

@Module({
    providers: [JwtConfigService, AwsS3Service],
    exports: [JwtConfigService, AwsS3Service]
})
export class customConfigModule { }