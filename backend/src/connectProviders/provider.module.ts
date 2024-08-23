import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProviderService } from './provider.service';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { TwitterStrategy } from './providerStrategys/twitter.strategy';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';

import { ProviderController } from './provider.controller';
import { customConfigModule } from 'src/config/config.module';
import { UserModule } from 'src/schemas/user.module';
import { HttpModule } from '@nestjs/axios';
import { GlobalStateModule } from 'src/utils/global-state.module';


@Module({
  imports: [
    PassportModule.register({}),
    customConfigModule,
    UserModule,
    HttpModule,
    GlobalStateModule
  ],
  controllers: [ProviderController],
  providers: [ProviderService, FacebookStrategy, InstagramStrategy, LinkedInStrategy, TwitterStrategy]
})
export class ProvidersModule { }
