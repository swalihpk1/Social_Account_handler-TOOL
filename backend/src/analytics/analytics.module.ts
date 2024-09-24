import { Module } from "@nestjs/common";
import { AnalyticService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from "src/schemas/post.schema";
import { ScheduledPost, ScheduledPostSchema } from "src/schemas/shedulePost.shcema";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        MongooseModule.forFeature([{ name: ScheduledPost.name, schema: ScheduledPostSchema }])
    ],
    providers: [AnalyticService],
    controllers: [AnalyticsController],
})
export class AnalyticsModule { }
