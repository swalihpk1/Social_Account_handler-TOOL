import { forwardRef, Module } from "@nestjs/common";
import { JwtConfigService } from "./jwt/jwt.config";
import { AwsS3Service } from "./aws/aws-s3.service";
import { BullQueueService } from "./taskSheduler/bullQueue";
import { PostModule } from "../postProviders/post.module";

@Module({
    imports: [forwardRef(() => PostModule)], 
    providers: [JwtConfigService, AwsS3Service, BullQueueService],
    exports: [JwtConfigService, AwsS3Service, BullQueueService]
})
export class customConfigModule { }
