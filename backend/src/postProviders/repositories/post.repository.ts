import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../schemas/post.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { ScheduledPost, ScheduledPostDocument } from '../../schemas/shedulePost.shcema';
import { PostConfiguration, PostConfigurationDocument } from '../../schemas/postConfiguration.schema';
import { IPostRepository } from '../interfaces/post.repository.interface';

@Injectable()
export class PostRepository implements IPostRepository {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>,
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>
    ) { }

    // Post Configuration
    async findPostConfiguration(): Promise<PostConfigurationDocument | null> {
        return this.postConfigurationModel.findOne().exec();
    }

    // User
    async findUserById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }

    // Posts
    async createPost(postData: {
        userId: string;
        content: any;
        platforms: Array<{ platform: string; response: any }>;
        image?: string;
        status: string;
        timestamp: string;
    }): Promise<PostDocument> {
        const newPost = new this.postModel(postData);
        return newPost.save();
    }

    async findPostsByUserId(userId: string): Promise<PostDocument[]> {
        return this.postModel.find({ userId }).exec();
    }

    // Scheduled Posts
    async createScheduledPost(postData: {
        userId: string;
        content: any;
        platforms: string[];
        image?: string;
        scheduledTime: Date;
        status: string;
    }): Promise<ScheduledPostDocument> {
        const scheduledPost = new this.scheduledPostModel(postData);
        return scheduledPost.save();
    }

    async findScheduledPostsByUserId(userId: string): Promise<ScheduledPostDocument[]> {
        return this.scheduledPostModel.find({ userId }).exec();
    }

    async findScheduledPostByJobId(jobId: string): Promise<ScheduledPostDocument | null> {
        return this.scheduledPostModel.findOne({ jobId }).exec();
    }

    async updateScheduledPost(jobId: string, updateData: any): Promise<ScheduledPostDocument | null> {
        return this.scheduledPostModel.findOneAndUpdate(
            { jobId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();
    }

    async deleteScheduledPost(postId: string): Promise<void> {
        await this.scheduledPostModel.findByIdAndDelete(postId);
    }

    async findScheduledPostById(postId: string): Promise<ScheduledPostDocument | null> {
        return this.scheduledPostModel.findById(postId);
    }
} 