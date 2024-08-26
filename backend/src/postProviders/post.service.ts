import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "src/schemas/user.schema";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { PostConfiguration, PostConfigurationDocument } from "src/schemas/postConfiguration.schema";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Post, PostDocument } from "src/schemas/post.schema";
import { AwsS3Service } from "src/config/aws/aws-s3.service";
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
import * as FormData from 'form-data';
const fs = require('fs');



@Injectable()
export class PostService {

    constructor(
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private awsS3Service: AwsS3Service,
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

    async createPost(content: any, file: Express.Multer.File | null, socialAccessTokens: Map<string, string>) {
        let imageUrl: string | null = null;
        let localImagePath: string | null = null;

        if (file) {

            localImagePath = file.path;

            try {
                imageUrl = await this.uploadImageToS3(file);
            } catch (error) {
                console.error('Failed to upload image to S3:', error.message);
                throw new Error('Failed to upload image to S3');
            }
        }

        const publishResults = await this.publishToAllPlatforms(
            content,
            localImagePath,
            imageUrl,
            socialAccessTokens
        );

        const platforms = publishResults.map(result => ({
            platform: result.platform,
            response: result.response || result.error,
        }));

        const postRecord = new this.postModel({
            content,
            image: imageUrl,
            platforms,
            timestamp: new Date(),
        });

        await postRecord.save();

        return publishResults;
    }

    async uploadImageToS3(file: Express.Multer.File): Promise<string> {
        try {
            const bucket = process.env.AWS_S3_BUCKET_NAME;
            const imageUrl = await this.awsS3Service.uploadFile(file, bucket);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image to S3:', error.message);
            throw new Error('Failed to upload image to S3');
        }
    }


    async postToFacebook(content: string, imageUrl: string | null, accessToken: string): Promise<any> {
        const url = imageUrl
            ? 'https://graph.facebook.com/v20.0/404645566059003/photos'
            : 'https://graph.facebook.com/v20.0/404645566059003/feed';

        const formData = new FormData();

        if (imageUrl) {
            try {
                if (fs.existsSync(imageUrl)) {
                    formData.append('source', fs.createReadStream(imageUrl));
                } else {
                    throw new Error(`File not found at path: ${imageUrl}`);
                }
            } catch (err) {
                console.error('Error reading file:', err.message);
                throw new Error('Failed to read the local image file.');
            }
        }

        formData.append('message', content);
        formData.append('access_token', accessToken);

        try {
            const response = await this.httpService.post(url, formData, {
                headers: formData.getHeaders(),
            }).toPromise();
            return response.data;
        } catch (error) {
            console.error('Error posting to Facebook:', error.response?.data || error.message);
            throw new Error('Failed to post content to Facebook');
        }
    }



    async postToTwitter(content: string, imagePath: string | null, accessToken: string): Promise<any> {
        try {
            const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
            const oauthInstance = new OAuth({
                consumer: {
                    key: process.env.TWITTER_CLIENT_ID,
                    secret: process.env.TWITTER_CLIENT_SECRET,
                },
                signature_method: 'HMAC-SHA1',
                hash_function(base_string, key) {
                    return crypto
                        .createHmac('sha1', key)
                        .update(base_string)
                        .digest('base64');
                },
            });

            let mediaId: string | null = null;

            if (imagePath) {
                if (!fs.existsSync(imagePath)) {
                    throw new Error(`Image not found at path: ${imagePath}`);
                }

                const mediaUploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
                const formData = new FormData();
                formData.append('media', fs.createReadStream(imagePath));

                const authHeader = oauthInstance.toHeader(
                    oauthInstance.authorize(
                        {
                            url: mediaUploadUrl,
                            method: 'POST',
                        },
                        {
                            key: accessToken,
                            secret: accessTokenSecret,
                        }
                    )
                );

                const mediaResponse = await lastValueFrom(
                    this.httpService.post(mediaUploadUrl, formData, {
                        headers: {
                            ...authHeader,
                            ...formData.getHeaders(),
                        },
                    })
                );

                if (mediaResponse.data && mediaResponse.data.media_id_string) {
                    mediaId = mediaResponse.data.media_id_string;
                } else {
                    throw new Error('Failed to upload media to Twitter');
                }
            }

            const tweetPostUrl = 'https://api.twitter.com/2/tweets';
            const tweetBody: any = {
                text: content,
            };

            if (mediaId) {
                tweetBody.media = {
                    media_ids: [mediaId],
                };
            }

            const authHeader = oauthInstance.toHeader(
                oauthInstance.authorize(
                    {
                        url: tweetPostUrl,
                        method: 'POST',
                    },
                    {
                        key: accessToken,
                        secret: accessTokenSecret,
                    }
                )
            );

            const tweetResponse = await lastValueFrom(
                this.httpService.post(tweetPostUrl, tweetBody, {
                    headers: {
                        ...authHeader,
                        'Content-Type': 'application/json',
                    },
                })
            );

            return tweetResponse.data;
        } catch (error) {
            console.error('Error posting to Twitter:', error.message);
            throw error;
        }
    }



    async postToLinkedIn(content: string, image: string | null, accessToken: string): Promise<any> {
        let assetId: string | null = null;
        const personId = 'Lu1y1zbkz2';

        if (image) {
            const registerUrl = 'https://api.linkedin.com/v2/assets?action=registerUpload';
            const registerBody = {
                registerUploadRequest: {
                    recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                    owner: `urn:li:person:${personId}`,
                    serviceRelationships: [
                        {
                            relationshipType: "OWNER",
                            identifier: "urn:li:userGeneratedContent"
                        }
                    ]
                }
            };

            try {
                const registerResponse = await this.httpService.post(registerUrl, registerBody, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).toPromise();

                assetId = registerResponse.data.value.asset;
                const mediaUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;

                const imageData = fs.readFileSync(image);

                const uploadResponse = await this.httpService.post(mediaUrl, imageData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'image/jpeg' 
                    }
                }).toPromise();
                
            } catch (error) {
                console.error("Error during image registration/upload:", error.response?.data || error.message);
                throw new Error("Image upload failed");
            }
        }

        const postUrl = 'https://api.linkedin.com/v2/ugcPosts';
        const postBody = {
            author: `urn:li:person:${personId}`,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: content
                    },
                    shareMediaCategory: assetId ? "IMAGE" : "NONE",
                    media: assetId ? [
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
                    ] : []
                }
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        };

        try {
            const postResponse = await this.httpService.post(postUrl, postBody, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).toPromise();


            return postResponse.data;
        } catch (error) {
            console.error("Error during post creation:", error.response?.data || error.message);
            throw new Error("Post creation failed");
        }
    }


    async postToInstagram(content: string, imageUrl: string, accessToken: string): Promise<any> {
        // Log the input parameters for verification
        console.log("INcontent", content);
        console.log("INimage", imageUrl);
        console.log("INaccessToken", accessToken);

        try {

            const createMediaUrl = `https://graph.facebook.com/v20.0/17841417036059286/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(content)}&access_token=${accessToken}`;

            const mediaResponse = await this.httpService.post(createMediaUrl).toPromise();

            const creationId = mediaResponse.data.id;

            const publishUrl = `https://graph.facebook.com/v20.0/17841417036059286/media_publish?creation_id=${creationId}&access_token=${accessToken}`;

            const publishResponse = await this.httpService.post(publishUrl).toPromise();

            return publishResponse.data;

        } catch (error) {

            console.error("Error posting to Instagram:", error);
            throw error; 
        }
    }




    async publishToAllPlatforms(content: any, localImagePath: string | null, s3ImageUrl: string | null, socialAccessTokens: Map<string, string>) {
        const platformPromises = [];

        for (const [platform, token] of socialAccessTokens) {
            if (!content[platform]) {
                continue;
            }

            platformPromises.push(
                (async () => {
                    try {
                        let response;
                        const platformContent = content[platform];
                        let platformImage = null;

                        switch (platform) {
                            case 'facebook':
                            case 'twitter':
                            case 'linkedin':
                                platformImage = localImagePath;
                                break;
                            case 'instagram':
                                platformImage = s3ImageUrl;
                                break;
                            default:
                                throw new Error(`Unsupported platform: ${platform}`);
                        }


                        switch (platform) {
                            case 'facebook':
                                response = await this.postToFacebook(platformContent, platformImage, token);
                                break;
                            case 'twitter':
                                response = await this.postToTwitter(platformContent, platformImage, token);
                                break;
                            case 'linkedin':
                                response = await this.postToLinkedIn(platformContent, platformImage, token);
                                break;
                            case 'instagram':
                                response = await this.postToInstagram(platformContent, platformImage, token);
                                break;
                            default:
                                throw new Error(`Unsupported platform: ${platform}`);
                        }
                        return { platform, response };
                    } catch (error) {
                        console.error(`Error posting to ${platform}:`, error.message);
                        return { platform, error: error.message };
                    }
                })()
            );
        }

        return Promise.all(platformPromises);
    }


}