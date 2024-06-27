import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProviderService } from './provider.service';
import { FacebookStrategy } from './facebook.strategy';
import { ProviderController } from './provider.controller';
import { JwtConfigModule } from 'src/config/jwt.module';
import { UserModule } from 'src/schemas/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'facebook' }),
    JwtConfigModule,
    UserModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService, FacebookStrategy]
})
export class ProvidersModule { }
