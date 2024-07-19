// src/schemas/postConfiguration.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostConfigurationDocument = PostConfiguration & Document;

@Schema()
export class PostConfiguration {
    @Prop({ type: Object })
    socialCharLimits: {
        facebook: number;
        instagram: number;
        linkedin: number;
        twitterx: number;
    };
}

export const PostConfigurationSchema = SchemaFactory.createForClass(PostConfiguration);
