import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { PostService } from 'src/postProviders/post.service';

@Injectable()
export class BullQueueService {
    private connection: Redis;
    private postScheduleQueue: Queue;

    constructor(private readonly postService: PostService) {
        this.connection = new Redis({
            host: '127.0.0.1',
            port: 6379,
            maxRetriesPerRequest: null,
        });

        console.log("Redis connection created:", this.connection.status);

        this.postScheduleQueue = new Queue('postSchedule', { connection: this.connection });
        console.log("Queue 'postSchedule' initialized.");
        new Worker('postSchedule', async (job) => {
            console.log("Worker processing job:", job.id);
            const { content, fileUrl, socialAccessTokens } = job.data;

            const socialAccessTokensMap = new Map<string, string>(
                Object.entries(socialAccessTokens) as [string, string][]
            );

            console.log("Social ", socialAccessTokensMap);

            await this.postService.createPost(content, fileUrl, socialAccessTokensMap);
            console.log("Post created successfully for job:", job.id);
        }, { connection: this.connection });

    }

    async addPostToQueue(data: any) {
        const { scheduledTime } = data;

        const delay = scheduledTime.getTime() - Date.now();

        if (delay <= 0) {
            throw new Error("Scheduled time must be in the future.");
        }

        await this.postScheduleQueue.add('postSchedule', data, {
            delay: delay,
        });

        console.log("Job added to queue with delay:", delay);
    }
}
