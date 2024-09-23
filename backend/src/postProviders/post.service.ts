import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
import * as path from 'path';
import { ScheduledPost, ScheduledPostDocument } from "src/schemas/shedulePost.shcema";
const fs = require('fs');
import { unlink } from 'fs/promises';
import { BullQueueService } from "src/config/taskSheduler/bullQueue.service";
import { GlobalStateService } from "src/utils/global-state.service";


@Injectable()
export class PostService {

    constructor(
        @InjectModel(PostConfiguration.name) private postConfigurationModel: Model<PostConfigurationDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(ScheduledPost.name) private scheduledPostModel: Model<ScheduledPostDocument>,
        private awsS3Service: AwsS3Service,
        private httpService: HttpService,
        private readonly bullQueueService: BullQueueService,
        private readonly globalStateService: GlobalStateService
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


        const url = `https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${keyword}`;
        const headers = {
            Authorization: process.env.RITEKIT_HASHTAG_ID,
        };
        const response = await lastValueFrom(this.httpService.get(url, { headers }));
        return response.data.data.map((item: any) => item.hashtag);
    }


    async handleCreatePost(file: Express.Multer.File, body: any) {
        try {
            const userId = this.globalStateService.getUserId();
            const foundUser = await this.userModel.findById(userId);

            if (!foundUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const socialAccessTokens = foundUser.socialAccessTokens;
            const content = JSON.parse(body.content);

            let imageUrl = null;
            if (file) {
                imageUrl = await this.uploadImageToS3(file);
            }

            const results = await this.createPost(content, file, socialAccessTokens);

            // Save the new post to the database
            const newPost = new this.postModel({
                userId,
                content,
                platforms: results.map(result => ({
                    platform: result.platform,
                    response: result.response || result.error,
                })),
                image: imageUrl,
                createdAt: new Date(),
            });
            await newPost.save();

            // Delete the uploaded file from the server
            if (file) {
                const filePath = path.join(process.cwd(), 'public', 'postImages', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Failed to delete the file:', err.message);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }

            return results.map(result => result.response || result.error);
        } catch (error) {
            console.error('Error while creating post:', error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createPost(content: any, file: Express.Multer.File | string | null, socialAccessTokens: Map<string, string>) {
        let localImagePath: string | null = null;
        let s3ImageUrl: string | null = null;

        if (file) {
            if (typeof file === 'string') {
                s3ImageUrl = file;
                localImagePath = await this.downloadImageFromS3(s3ImageUrl);
            } else {
                localImagePath = path.join(process.cwd(), 'public', 'postImages', file.filename);
                s3ImageUrl = await this.awsS3Service.uploadFile(file);
            }
        }

        const publishResults = await this.publishToAllPlatforms(content, localImagePath, s3ImageUrl, socialAccessTokens);

        if (localImagePath && typeof file === 'string') {
            fs.unlink(localImagePath, (err) => {
                if (err) {
                    console.error('Failed to delete local image:', err.message);
                } else {
                    console.log('Local image deleted:', localImagePath);
                }
            });
        }

        return publishResults;
    }


    async uploadImageToS3(file: Express.Multer.File): Promise<string> {
        try {
            const imageUrl = await this.awsS3Service.uploadFile(file);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image to S3:', error.message);
            throw new Error('Failed to upload image to S3');
        }
    }

    async downloadImageFromS3(imageUrl: string): Promise<string> {
        try {
            const imagePath = path.join(process.cwd(), 'public', 'postImages', path.basename(imageUrl));
            const imageStream = fs.createWriteStream(imagePath);

            const response = await this.httpService.get(imageUrl, { responseType: 'stream' }).toPromise();
            response.data.pipe(imageStream);

            return new Promise((resolve, reject) => {
                imageStream.on('finish', () => resolve(imagePath));
                imageStream.on('error', reject);
            });
        } catch (error) {
            console.error('Error downloading image from S3:', error.message);
            throw new Error('Failed to download image from S3');
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


    async publishToAllPlatforms(
        content: any, localImagePath: string | null, s3ImageUrl: string | null, socialAccessTokens: Map<string, string>) {

        console.log('Starting publishToAllPlatforms with:', { content, localImagePath, s3ImageUrl, socialAccessTokens });


        const platformPromises = [];

        for (const [platform, token] of socialAccessTokens.entries()) {

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

                        console.log(`Image path for ${platform}:`, platformImage);

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

        const results = await Promise.all(platformPromises);
        console.log('All platform posting completed. Results:', results);
        return results;
    }


    async schedulePost(file: Express.Multer.File, body: any) {
        try {
            const userId = this.globalStateService.getUserId();
            const foundUser = await this.userModel.findById(userId);

            if (!foundUser) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const socialAccessTokens = foundUser.socialAccessTokens;
            const content = JSON.parse(body.content);
            const scheduledTime = new Date(body.scheduledTime);

            let imageUrl = null;
            if (file) {
                imageUrl = await this.uploadImageToS3(file);
            }

            const platforms = Object.keys(content);

            const scheduledPost = new this.scheduledPostModel({
                userId,
                content,
                platforms,
                image: imageUrl,
                scheduledTime,
                status: 'scheduled',
            });

            await scheduledPost.save();

            const jobData = {
                _id: scheduledPost._id,
                userId,
                content,
                fileUrl: imageUrl,
                socialAccessTokens,
                scheduledTime,
            };

            const jobId = await this.bullQueueService.addPostToQueue(jobData);
            scheduledPost.jobId = jobId;
            await scheduledPost.save();

        } catch (error) {
            console.error('Error scheduling post:', error);
            throw new HttpException('Failed to schedule post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAllPosts() {
        try {
            const userId = this.globalStateService.getUserId();
            console.log('userId', userId);

            const scheduledPosts = await this.scheduledPostModel.find({ userId }).exec();
            console.log('Scheduled posts', scheduledPosts);

            const postedPosts = await this.postModel.find({ userId }).exec();
            console.log('Posted posts', postedPosts);

            const mergedPosts = [...scheduledPosts, ...postedPosts];

            return mergedPosts;
        } catch (error) {
            console.error('Error fetching posts:', error.message);
            throw new HttpException('Error fetching posts', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async reschedulePost(jobId: string, scheduledTime: string): Promise<{ message: string; jobId?: string }> {
        const newScheduledTime = new Date(scheduledTime);

        if (newScheduledTime <= new Date()) {
            throw new HttpException('Scheduled time must be in the future.', HttpStatus.BAD_REQUEST);
        }

        const updatedJobId = await this.bullQueueService.reschedulePost(jobId, newScheduledTime);

        return {
            message: 'Post successfully rescheduled.',
            jobId: updatedJobId
        };
    }


    async deleteScheduledPost(jobId: string): Promise<{ message: string }> {
        const scheduledPost = await this.scheduledPostModel.findOne({ jobId });

        if (!scheduledPost) {
            throw new HttpException('Scheduled post not found', HttpStatus.NOT_FOUND);
        }

        const job = await this.bullQueueService.postScheduleQueue.getJob(jobId);

        if (job) {
            await job.remove();
            console.log(`Job ${jobId} removed from the queue`);
        } else {
            console.log(`Job ${jobId} not found in the queue`);
        }

        await this.scheduledPostModel.findByIdAndDelete(scheduledPost._id);
        console.log(`Scheduled post with jobId ${jobId} deleted from database`);

        return { message: 'Scheduled post deleted successfully' };
    }


    async updateSchedulePost(
        jobId: string,
        updateData: { platform: string; content: string; imageUrl?: string },
        file: Express.Multer.File
    ) {
        const post = await this.scheduledPostModel.findOne({ jobId });
        if (!post) {
            throw new Error('Scheduled post not found');
        }

        let updateObject: any = {};

        if (updateData.platform && updateData.content) {
            try {
                const contentUpdate = JSON.parse(updateData.content)[updateData.platform];
                updateObject[`content.${updateData.platform}`] = contentUpdate;
            } catch (error) {
                console.error('Error parsing content:', error);
                throw new Error('Invalid content format');
            }
        }

        let newImageUrl: string | undefined;
        if (file) {
            try {
                newImageUrl = await this.awsS3Service.uploadFile(file);
                await unlink(file.path);
            } catch (error) {
                console.error('Error uploading image to S3 or deleting temp file:', error);
                throw new Error('Failed to process uploaded image');
            }
        } else if (updateData.imageUrl) {
            newImageUrl = updateData.imageUrl;
        }

        if (newImageUrl) {
            updateObject.image = newImageUrl;
        }

        if (updateData.platform && !post.platforms.includes(updateData.platform)) {
            updateObject.$addToSet = { platforms: updateData.platform };
        }

        const result = await this.scheduledPostModel.updateOne(
            { jobId: jobId },
            { $set: updateObject },
            { new: true, runValidators: true }
        );

        if (result.matchedCount === 0) {
            throw new Error('Failed to update post');
        }

        const updatedPost = await this.scheduledPostModel.findOne({ jobId });
        return updatedPost;
    }



}