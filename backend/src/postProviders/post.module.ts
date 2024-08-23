
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostConfiguration, PostConfigurationSchema } from '../schemas/postConfiguration.schema';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

import { Post, PostSchema } from '../schemas/post.schema';
import { UserModule } from 'src/schemas/user.module';
import { GlobalStateModule } from 'src/utils/global-state.module';
import { customConfigModule } from 'src/config/config.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PostConfiguration.name, schema: PostConfigurationSchema },
            { name: Post.name, schema: PostSchema },
        ]),
        UserModule,
        GlobalStateModule,
        MulterModule.register({
            dest: 'public/postImages',
        }),
        HttpModule,
        customConfigModule
    ],
    providers: [PostService],
    exports: [PostService],
    controllers: [PostController],
})
export class PostModule { }