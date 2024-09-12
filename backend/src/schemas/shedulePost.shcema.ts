import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduledPostDocument = ScheduledPost & Document;

@Schema()
export class ScheduledPost {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Object, required: true })
    content: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };

    @Prop({ type: [String], required: true })
    platforms: string[];

    @Prop({ type: String })
    image: string;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ type: Date, required: true })
    scheduledTime: Date;

    @Prop({ type: String, default: 'scheduled' })
    status: string;
}

export const ScheduledPostSchema = SchemaFactory.createForClass(ScheduledPost);