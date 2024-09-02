import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduledPostDocument = ScheduledPost & Document;

@Schema()
export class ScheduledPost {
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
        response?: any;
    }[];

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
