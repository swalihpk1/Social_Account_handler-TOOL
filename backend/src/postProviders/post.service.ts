import { Injectable, Logger } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { PostConfiguration, PostConfigurationDocument } from "src/schemas/postConfiguration.schema";
import { CreatePostDto } from "./dto/createPost.dto";
import { create } from "domain";

@Injectable()
export class PostService {
    private readonly logger = new Logger(PostService.name);
    constructor(
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>,
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

    async createPost(post: CreatePostDto) {
        console.log("vann");
        console.log("new", post);
    }
}