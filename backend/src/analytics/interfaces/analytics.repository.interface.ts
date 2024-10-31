import { PostDocument } from "src/schemas/post.schema";
import { ScheduledPostDocument } from "src/schemas/shedulePost.shcema";

export interface IAnalyticsRepository {
    // Post Analytics
    getPostsByPlatform(userId: string): Promise<Array<{ _id: string; count: number }>>;
    getScheduledPostsByPlatform(userId: string): Promise<Array<{ _id: string; count: number }>>;
    getTotalPostCount(userId: string): Promise<number>;
    getBestPostingTimeAnalytics(userId: string): Promise<any[]>;

    // Best Posts
    getPostsWithImages(userId: string): Promise<PostDocument[]>;
} 