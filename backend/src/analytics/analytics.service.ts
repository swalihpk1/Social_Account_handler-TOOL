import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from "src/schemas/post.schema";
import { ScheduledPost, ScheduledPostDocument } from "src/schemas/shedulePost.shcema";


@Injectable()
export class AnalyticService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>,
    ) { }

    async getAllAnalytics(userId: string) {
        const totalPostCounts = await this.getPostsByPlatform(userId);
        const scheduledPostCount = await this.getScheduledPosted(userId);
        const getBestPostingTime = await this.getBestPostingTime(userId);
        const platformEngagement = await this.getPlatformEngagement(userId);
        return {
            totalPostCounts,
            scheduledPostCount,
            getBestPostingTime,
            platformEngagement,
        };
    }

    private async getPostsByPlatform(userId: string) {
        return await this.postModel.aggregate([
            { $match: { userId } }, // Filter by userId
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: "$platforms.platform",
                    count: { $sum: 1 },
                },
            },
        ]).exec();
    }

    private async getScheduledPosted(userId: string) {
        return await this.scheduledPostModel.aggregate([
            { $match: { userId } }, // Filter by userId
            { $unwind: "$platforms" },
            {
                $group: {
                    _id: "$platforms",
                    count: { $sum: 1 },
                },
            },
        ]).exec();
    }

    private async getPlatformEngagement(userId: string) {
        const totalPosts = await this.postModel.countDocuments({ userId }); // Filter by userId
        const platformCounts = await this.getPostsByPlatform(userId);

        return platformCounts.map(platform => ({
            platform: platform._id,
            engagementRate: (platform.count / totalPosts) * 100,
        }));
    }

    private async getBestPostingTime(userId: string) {
        const data = await this.postModel.aggregate([
            { $match: { userId } }, // Filter by userId
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

        const formattedData = data.map(item => ({
            platform: item.platform,
            bestTimes: item.bestTimes.map(time => ({
                day: this.getDayName(time.dayOfWeek),
                hour: this.formatHour(time.hour),
                postCount: time.postCount,
                averageEngagement: time.averageEngagement
            }))
        }));

        return formattedData;
    }

    private getDayName(dayOfWeek: number): string {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayOfWeek - 1];
    }

    private formatHour(hour: number): string {
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour} ${period}`;
    }

    async getBestPosts(userId: string) {
        const allPostsWithImages = await this.postModel
            .find({ userId, image: { $exists: true, $ne: '' } })
            .exec();
        const shuffledPosts = allPostsWithImages.sort(() => 0.5 - Math.random());
        const bestPosts = shuffledPosts.slice(0, 5);
    
        return bestPosts;
    }
    
}
