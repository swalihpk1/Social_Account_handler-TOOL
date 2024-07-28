// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostConfiguration, PostConfigurationSchema } from 'src/schemas/postConfiguration.schema';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PostConfiguration.name, schema: PostConfigurationSchema }]),
        MulterModule.register({
            dest: 'public/postImages',
        }),
        HttpModule,
    ],
    providers: [PostService],
    exports: [PostService],
    controllers: [PostController],
})
export class PostModule { }
