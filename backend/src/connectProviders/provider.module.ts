import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProviderService } from './provider.service';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { TwitterStrategy } from './providerStrategys/twitter.strategy';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';

import { ProviderController } from './provider.controller';
import { CustomConfigModule } from 'src/config/customConfig.module';
import { UserModule } from 'src/schemas/user.module';
import { HttpModule } from '@nestjs/axios';
import { GlobalStateModule } from 'src/utils/global-state.module';
import { ProviderRepository } from './repositories/provider.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    PassportModule.register({}),
    CustomConfigModule,
    UserModule,
    HttpModule,
    GlobalStateModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [ProviderController],
  providers: [
    ProviderService,
    FacebookStrategy,
    InstagramStrategy,
    LinkedInStrategy,
    TwitterStrategy,
    ProviderRepository,
    {
      provide: 'IProviderRepository',
      useClass: ProviderRepository
    }
  ]
})
export class ProvidersModule { }
