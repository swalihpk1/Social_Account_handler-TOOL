import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { PostService } from 'src/postProviders/post.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledPostDocument } from 'src/schemas/shedulePost.shcema';
import { PostDocument } from 'src/schemas/post.schema';


@Injectable()
export class BullQueueService {
    private connection: Redis;
    private postScheduleQueue: Queue;

    constructor(
        private readonly postService: PostService,
        @InjectModel('ScheduledPost') private scheduledPostModel: Model<ScheduledPostDocument>,
        @InjectModel('Post') private postModel: Model<PostDocument>
    ) {
        this.connection = new Redis({
            host: '127.0.0.1',
            port: 6379,
            maxRetriesPerRequest: null,
        });

        this.postScheduleQueue = new Queue('postSchedule', { connection: this.connection });

        new Worker('postSchedule', async (job) => {
            try {
                console.log("Worker processing job:", job.id);
                const { _id, userId, content, fileUrl, socialAccessTokens } = job.data;

                const socialAccessTokensMap = new Map<string, string>(
                    Object.entries(socialAccessTokens) as [string, string][]
                );

                const publishResults = await this.postService.createPost(content, fileUrl, socialAccessTokensMap);

                const newPost = new this.postModel({
                    userId,
                    content,
                    platforms: publishResults.map(result => ({
                        platform: result.platform,
                        response: result.response || result.error,
                    })),
                    image: fileUrl,
                    createdAt: new Date(),
                });

                await newPost.save();

                await this.scheduledPostModel.findByIdAndDelete(_id);

                console.log("Post successfully processed, transferred to Post schema, and removed from ScheduledPost schema for job:", job.id);
            } catch (error) {
                console.error("Error processing job:", error.message);
                await this.scheduledPostModel.findByIdAndUpdate(job.data._id, {
                    status: 'failed',
                    error: error.message,
                });
            }
        }, { connection: this.connection });
    }

    async addPostToQueue(data: any) {
        const { scheduledTime } = data;
        const delay = scheduledTime.getTime() - Date.now();

        if (delay <= 0) {
            throw new Error("Scheduled time must be in the future.");
        }

        const job = await this.postScheduleQueue.add('postSchedule', data, { delay });

        console.log("Job added to queue with delay:", delay);
        return job.id;
    }

}