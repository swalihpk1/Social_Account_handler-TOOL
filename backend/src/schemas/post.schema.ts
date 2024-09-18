import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Object, required: true })
    content: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };

    @Prop({ type: Array, required: true })
    platforms: {
        platform: string;
        response: any;
    }[];

    @Prop({ type: String })
    image: string;

    @Prop({ type: String, default: 'posted' })
    status: string;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
