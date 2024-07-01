import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProviderService } from './provider.service';
import { FacebookStrategy } from './providerStrategys/facebook.strategy';
import { InstagramStrategy } from './providerStrategys/instagram.strategy';
import { ProviderController } from './provider.controller';
import { JwtConfigModule } from 'src/config/jwt.module';
import { UserModule } from 'src/schemas/user.module';
import { HttpModule } from '@nestjs/axios';
import { LinkedInStrategy } from './providerStrategys/linkedIn.strategy';


@Module({
  imports: [
    PassportModule.register({}),
    JwtConfigModule,
    UserModule,
    HttpModule
  ],
  controllers: [ProviderController],
  providers: [ProviderService, FacebookStrategy, InstagramStrategy, LinkedInStrategy]
})
export class ProvidersModule { }
