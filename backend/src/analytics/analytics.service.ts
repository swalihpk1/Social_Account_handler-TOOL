import { Inject, Injectable } from "@nestjs/common";
import { IAnalyticsRepository } from "./interfaces/analytics.repository.interface";

@Injectable()
export class AnalyticService {
    constructor(
        @Inject('IAnalyticsRepository') private analyticsRepository: IAnalyticsRepository
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
        return await this.analyticsRepository.getPostsByPlatform(userId);
    }

    private async getScheduledPosted(userId: string) {
        return await this.analyticsRepository.getScheduledPostsByPlatform(userId);
    }

    private async getPlatformEngagement(userId: string) {
        const totalPosts = await this.analyticsRepository.getTotalPostCount(userId);
        const platformCounts = await this.analyticsRepository.getPostsByPlatform(userId);

        return platformCounts.map(platform => ({
            platform: platform._id,
            engagementRate: (platform.count / totalPosts) * 100,
        }));
    }

    private async getBestPostingTime(userId: string) {
        const data = await this.analyticsRepository.getBestPostingTimeAnalytics(userId);

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
        const allPostsWithImages = await this.analyticsRepository.getPostsWithImages(userId);
        const shuffledPosts = allPostsWithImages.sort(() => 0.5 - Math.random());
        return shuffledPosts.slice(0, 5);
    }
}
