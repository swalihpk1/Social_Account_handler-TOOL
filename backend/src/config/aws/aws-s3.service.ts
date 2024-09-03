import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AwsS3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            region: process.env.AWS_REGION,
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        try {
            const bucket = process.env.AWS_S3_BUCKET_NAME;
            

            if (!bucket) {
                throw new Error('S3 bucket name is not defined in environment variables');
            }

            const fileKey = `${Date.now()}_${file.originalname}`;
            const filePath = path.join(file.destination, file.filename);
            const fileBuffer = fs.readFileSync(filePath);

            const params: PutObjectCommandInput = {
                Bucket: bucket,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(params);
            await this.s3.send(command);

            const imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
            return imageUrl;
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw new Error('Failed to upload image to S3');
        }
    }
}
