import { AuthConfig } from './../config/auth.config';
import { TypedConfigService } from './../config/typed-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) => {
        const authConfig = config.get<AuthConfig>('auth');
        return {
          secret: authConfig?.jwt.secret ?? 'default-secret',
          signOptions: {
            expiresIn: authConfig?.jwt.expiresIn ?? '60m',
          } as JwtSignOptions,
        };
      },
    }),
  ],
})
export class UsersModule {}
