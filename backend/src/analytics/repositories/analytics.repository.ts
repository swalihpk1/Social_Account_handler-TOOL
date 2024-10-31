import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../schemas/post.schema';
import { ScheduledPost, ScheduledPostDocument } from '../../schemas/shedulePost.shcema';
import { IAnalyticsRepository } from '../interfaces/analytics.repository.interface';

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepository {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>,
    ) { }

    async getPostsByPlatform(userId: string): Promise<Array<{ _id: string; count: number }>> {
        return this.postModel.aggregate([
            { $match: { userId } },
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: "$platforms.platform",
                    count: { $sum: 1 },
                },
            },
        ]).exec();
    }

    async getScheduledPostsByPlatform(userId: string): Promise<Array<{ _id: string; count: number }>> {
        return this.scheduledPostModel.aggregate([
            { $match: { userId } },
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: "$platforms",
                    count: { $sum: 1 },
                },
            },
        ]).exec();
    }

    async getTotalPostCount(userId: string): Promise<number> {
        return this.postModel.countDocuments({ userId });
    }

    async getBestPostingTimeAnalytics(userId: string): Promise<any[]> {
        return this.postModel.aggregate([
            { $match: { userId } },
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: {
                        platform: "$platforms.platform",
                        hour: { $hour: { date: "$timestamp", timezone: "UTC" } },
                        dayOfWeek: { $dayOfWeek: { date: "$timestamp", timezone: "UTC" } },
                    },
                    postCount: { $sum: 1 },
                    posts: { $push: "$$ROOT" }
                },
            },
            {
                $project: {
                    platform: "$_id.platform",
                    hour: "$_id.hour",
                    dayOfWeek: "$_id.dayOfWeek",
                    postCount: 1,
                    averageEngagement: {
                        $avg: {
                            $size: {
                                $filter: {
                                    input: "$posts.platforms",
                                    as: "platform",
                                    cond: { $eq: ["$$platform.platform", "$_id.platform"] }
                                }
                            }
                        }
                    }
                }
            },
            { $sort: { averageEngagement: -1, postCount: -1 } },
            {
                $group: {
                    _id: "$platform",
                    bestTimes: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    platform: "$_id",
                    bestTimes: { $slice: ["$bestTimes", 3] }
                }
            }
        ]).exec();
    }

    async getPostsWithImages(userId: string): Promise<PostDocument[]> {
        return this.postModel
            .find({ userId, image: { $exists: true, $ne: '' } })
            .exec();
    }
} 