import { Injectable, Logger } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { PostConfiguration, PostConfigurationDocument } from "src/schemas/postConfiguration.schema";
import { CreatePostDto } from "./dto/createPost.dto";
import { create } from "domain";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class PostService {

    constructor(
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>,
        private httpService: HttpService
    ) { }

    async fetchCharacterLimits() {
        try {
            const config = await this.postConfigurationModel.findOne().exec();
            if (!config) {
                throw new Error('Post configuration not found');
            }
            return config.socialCharLimits;
        } catch (error) {
            throw new Error(`Error fetching character limits: ${error.message}`);
        }
    }

    async fetchHashtags(keyword: string): Promise<string[]> {

        console.log("Hashtags");
        const url = `https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${keyword}`;
        const headers = {
            Authorization: process.env.RITEKIT_HASHTAG_ID,
        };
        const response = await lastValueFrom(this.httpService.get(url, { headers }));
        return response.data.data.map((item: any) => item.hashtag);
    }

    async createPost(post: CreatePostDto) {
        console.log("vann");
        console.log("new", post);
    }
}