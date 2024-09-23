import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConfigService } from "./jwt/jwt.config";
import { AwsS3Service } from "./aws/aws-s3.service";
import { PostModule } from 'src/postProviders/post.module';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { ScheduledPost, ScheduledPostSchema } from 'src/schemas/shedulePost.shcema';
import { BullQueueService } from './taskSheduler/bullQueue.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ScheduledPost.name, schema: ScheduledPostSchema },
            { name: Post.name, schema: PostSchema },
        ]),
        forwardRef(() => PostModule),
    ],
    providers: [
        JwtConfigService,
        AwsS3Service,
        BullQueueService,
        {
            provide: 'ScheduledPostModel',
            useFactory: (connection) => connection.model(ScheduledPost.name),
            inject: ['DatabaseConnection'],
        },
        {
            provide: 'PostModel',
            useFactory: (connection) => connection.model(Post.name),
            inject: ['DatabaseConnection'],
        },
    ],
    exports: [JwtConfigService, AwsS3Service, BullQueueService],
})
export class CustomConfigModule { }