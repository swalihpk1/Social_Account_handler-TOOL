import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersModule } from './connectProviders/provider.module';
import { CustomConfigModule } from './config/customConfig.module';
import { UserModule } from './schemas/user.module';
import * as session from 'express-session';
import { PostModule } from './postProviders/post.module';
import { GlobalStateModule } from './utils/global-state.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        Logger.log(` MONGO_DB CONNECTED`, 'MongooseModule');
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    ProvidersModule,
    CustomConfigModule,
    UserModule,
    PostModule,
    GlobalStateModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      }))
      .forRoutes('*');
  }
}