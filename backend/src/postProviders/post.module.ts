import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostConfiguration, PostConfigurationSchema } from '../schemas/postConfiguration.schema';
import { PostController } from './post.controller';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { Post, PostSchema } from '../schemas/post.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { UserModule } from 'src/schemas/user.module';
import { GlobalStateModule } from 'src/utils/global-state.module';
import { CustomConfigModule } from 'src/config/customConfig.module';
import { ScheduledPost, ScheduledPostSchema } from 'src/schemas/shedulePost.shcema';
import { PostRepository } from './repositories/post.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PostConfiguration.name, schema: PostConfigurationSchema },
            { name: Post.name, schema: PostSchema },
            { name: ScheduledPost.name, schema: ScheduledPostSchema },
            { name: User.name, schema: UserSchema }
        ]),
        UserModule,
        GlobalStateModule,
        MulterModule.register({
            dest: 'public/postImages',
        }),
        HttpModule,
        forwardRef(() => CustomConfigModule),
    ],
    providers: [
        PostService,
        PostRepository,
        {
            provide: 'IPostRepository',
            useClass: PostRepository
        }
    ],
    exports: [PostService],
    controllers: [PostController],
})
export class PostModule { }