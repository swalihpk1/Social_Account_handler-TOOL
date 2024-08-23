import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

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

    async uploadFile(file: Express.Multer.File, bucket: string): Promise<string> {
        const fileKey = `${Date.now()}_${file.originalname}`;
        const params: PutObjectCommandInput = {
            Bucket: bucket,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: 'public-read', // Commented out since your bucket doesn't allow ACLs
        };

        const command = new PutObjectCommand(params);
        await this.s3.send(command);

        // Manually construct the URL
        const imageUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        return imageUrl;
    }
}
