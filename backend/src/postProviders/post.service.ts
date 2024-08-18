import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { PostConfiguration, PostConfigurationDocument } from "src/schemas/postConfiguration.schema";
// import { CreatePostDto } from "./dto/createPost.dto";
import { create } from "domain";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Post, PostDocument } from "src/schemas/post.schema";
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class PostService {

    constructor(
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private httpService: HttpService,
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

    async postToFacebook(content: string, imagePath: string, accessToken: string): Promise<any> {
        const url = `https://graph.facebook.com/v20.0/404645566059003/photos`;
        const formData = new FormData();

        if (imagePath) {
            formData.append('source', fs.createReadStream(imagePath));
        }

        formData.append('message', content);
        formData.append('access_token', accessToken);

        return this.httpService.post(url, formData, {
            headers: formData.getHeaders(),
        }).toPromise();
    }



    async postToTwitter(content: string, accessToken: string, accessTokenSecret: string): Promise<any> {
        const url = `https://api.twitter.com/2/tweets`;
        const body = {
            text: content
        };

        return this.httpService.post(url, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).toPromise();
    }

    async postToLinkedIn(content: string, image: string, accessToken: string): Promise<any> {
        const registerUrl = 'https://api.linkedin.com/v2/assets?action=registerUpload';
        const postUrl = 'https://api.linkedin.com/v2/ugcPosts';

        // Register image upload (if image is provided)
        const registerBody = {
            registerUploadRequest: {
                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                owner: "urn:li:person:{person-id}",
                serviceRelationships: [
                    {
                        relationshipType: "OWNER",
                        identifier: "urn:li:userGeneratedContent"
                    }
                ]
            }
        };

        const registerResponse = await this.httpService.post(registerUrl, registerBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).toPromise();

        const assetId = registerResponse.data.value.asset;

        // Upload the image
        const mediaUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        await this.httpService.post(mediaUrl, image, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'image/jpeg'
            }
        }).toPromise();

        // Post UGC content
        const postBody = {
            author: "urn:li:person:{person-id}",
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: content
                    },
                    shareMediaCategory: "IMAGE",
                    media: [
                        {
                            status: "READY",
                            description: {
                                text: "Image"
                            },
                            media: assetId,
                            title: {
                                text: "Post from API"
                            }
                        }
                    ]
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        };

        return this.httpService.post(postUrl, postBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).toPromise();
    }

    async postToInstagram(content: string, imageUrl: string, accessToken: string): Promise<any> {
        const createMediaUrl = `https://graph.facebook.com/v20.0/{instagram-account-id}/media?image_url=${imageUrl}&caption=${content}&access_token=${accessToken}`;
        const mediaResponse = await this.httpService.post(createMediaUrl).toPromise();

        const creationId = mediaResponse.data.id;
        const publishUrl = `https://graph.facebook.com/v20.0/{instagram-account-id}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;

        return this.httpService.post(publishUrl).toPromise();
    }

    async publishToAllPlatforms(content: any, image: string | null, libraryImage: any, socialAccessTokens: Map<string, string>): Promise<any> {
        const promises = [];

        if (content.facebook) {
            promises.push(this.postToFacebook(content.facebook, image || libraryImage?.src, socialAccessTokens.get('facebook')));
        }


        if (content.twitter) {
            promises.push(this.postToTwitter(content.twitter, socialAccessTokens.get('twitter'), socialAccessTokens.get('twitterSecret')));
        }

        if (content.linkedin) {
            promises.push(this.postToLinkedIn(content.linkedin, image || libraryImage.src, socialAccessTokens.get('linkedin')));
        }

        if (content.instagram) {
            promises.push(this.postToInstagram(content.instagram, image || libraryImage.src, socialAccessTokens.get('instagram')));
        }

        return Promise.all(promises);
    }

    async create(post: Partial<Post>): Promise<Post> {
        const createdPost = new this.postModel(post);
        return createdPost.save();
    }
}