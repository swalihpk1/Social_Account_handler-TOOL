import { Module } from "@nestjs/common";
import { AnalyticService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from "src/schemas/post.schema";
import { ScheduledPost, ScheduledPostSchema } from "src/schemas/shedulePost.shcema";
import { GlobalStateModule } from 'src/utils/global-state.module';
import { AnalyticsRepository } from "./repositories/analytics.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Post.name, schema: PostSchema },
            { name: ScheduledPost.name, schema: ScheduledPostSchema }
        ]),
        GlobalStateModule,
    ],
    providers: [
        AnalyticService,
        AnalyticsRepository,
        {
            provide: 'IAnalyticsRepository',
            useClass: AnalyticsRepository
        }
    ],
    controllers: [AnalyticsController],
})
export class AnalyticsModule { }
