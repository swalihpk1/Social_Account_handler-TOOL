import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { forwardRef, Inject, Injectable, Post } from '@nestjs/common';
import { PostService } from 'src/postProviders/post.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledPost, ScheduledPostDocument } from 'src/schemas/shedulePost.shcema';
import { PostDocument } from 'src/schemas/post.schema';
import { CustomException } from '../../exceptions/custom.exception';


@Injectable()
export class BullQueueService {
    private connection: Redis;
    public postScheduleQueue: Queue;

    constructor(
        @Inject(forwardRef(() => PostService))
        private readonly postService: PostService,
        @Inject('ScheduledPostModel')
        private scheduledPostModel: Model<ScheduledPostDocument>,
        @Inject('PostModel')
        private postModel: Model<PostDocument>
    ) {
        this.connection = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
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
        try {
            const { scheduledTime } = data;
            const delay = scheduledTime.getTime() - Date.now();

            if (delay <= 0) {
                throw new CustomException('Scheduled time must be in the future', 400);
            }

            const job = await this.postScheduleQueue.add('postSchedule', data, { delay });
            return job.id;
        } catch (error) {
            if (error instanceof CustomException) throw error;
            throw new CustomException('Failed to schedule post', 500);
        }
    }

    async reschedulePost(jobId: string, newScheduledTime: Date) {
        try {
            const job = await this.postScheduleQueue.getJob(jobId);

            if (!job) {
                throw new CustomException('Scheduled post not found', 404);
            }

            await job.remove();

            const newDelay = newScheduledTime.getTime() - Date.now();
            const newJobData = job.data;
            newJobData.scheduledTime = newScheduledTime;

            const newJob = await this.postScheduleQueue.add('postSchedule', newJobData, { delay: newDelay });


            await this.scheduledPostModel.findByIdAndUpdate(job.data._id, {
                scheduledTime: newScheduledTime,
                jobId: newJob.id,
            });

            return newJob.id;
        } catch (error) {
            if (error instanceof CustomException) throw error;
            throw new CustomException('Failed to reschedule post', 500);
        }
    }
}