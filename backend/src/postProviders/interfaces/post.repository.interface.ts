import { PostConfigurationDocument } from "src/schemas/postConfiguration.schema";
import { PostDocument } from "src/schemas/post.schema";
import { ScheduledPostDocument } from "src/schemas/shedulePost.shcema";
import { UserDocument } from "src/schemas/user.schema";

export interface IPostRepository {
    // Post Configuration
    findPostConfiguration(): Promise<PostConfigurationDocument | null>;

    // User
    findUserById(userId: string): Promise<UserDocument | null>;

    // Posts
    createPost(postData: {
        userId: string;
        content: any;
        platforms: Array<{ platform: string; response: any }>;
        image?: string;
        status: string;
        timestamp: string;
    }): Promise<PostDocument>;
    findPostsByUserId(userId: string): Promise<PostDocument[]>;

    // Scheduled Posts
    createScheduledPost(postData: {
        userId: string;
        content: any;
        platforms: string[];
        image?: string;
        scheduledTime: Date;
        status: string;
    }): Promise<ScheduledPostDocument>;
    findScheduledPostsByUserId(userId: string): Promise<ScheduledPostDocument[]>;
    findScheduledPostByJobId(jobId: string): Promise<ScheduledPostDocument | null>;
    updateScheduledPost(jobId: string, updateData: any): Promise<ScheduledPostDocument | null>;
    deleteScheduledPost(postId: string): Promise<void>;
    findScheduledPostById(postId: string): Promise<ScheduledPostDocument | null>;
} 