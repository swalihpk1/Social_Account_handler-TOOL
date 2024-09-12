import { forwardRef, Module } from "@nestjs/common";
import { JwtConfigService } from "./jwt/jwt.config";
import { AwsS3Service } from "./aws/aws-s3.service";
import { BullQueueService } from "./taskSheduler/bullQueue";
import { PostModule } from "../postProviders/post.module";
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduledPostSchema } from "src/schemas/shedulePost.shcema";
import { PostSchema } from 'src/schemas/post.schema';

@Module({
    imports: [
        forwardRef(() => PostModule),
        MongooseModule.forFeature([
            { name: 'ScheduledPost', schema: ScheduledPostSchema },
            { name: 'Post', schema: PostSchema }
        ]), 
    ],
    providers: [JwtConfigService, AwsS3Service, BullQueueService],
    exports: [JwtConfigService, AwsS3Service, BullQueueService]
})
export class customConfigModule { }
