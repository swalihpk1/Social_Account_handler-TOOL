import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProviderService } from './provider.service';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';
import { TwitterStrategy } from './providerStrategys/twitter.strategy';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';

import { ProviderController } from './provider.controller';
import { JwtConfigModule } from 'src/config/jwt.module';
import { UserModule } from 'src/schemas/user.module';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    PassportModule.register({}),
    JwtConfigModule,
    UserModule,
    HttpModule
  ],
  controllers: [ProviderController],
  providers: [ProviderService, FacebookStrategy, InstagramStrategy, LinkedInStrategy, TwitterStrategy]
})
export class ProvidersModule { }
