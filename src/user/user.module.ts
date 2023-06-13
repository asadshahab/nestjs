import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import * as dotenv from 'dotenv';
import { UserSubscriber } from './subscriber/user-subscriber';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth/auth.resolver';
import { PaginationModule } from '../pagination/pagination.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: 60 * 60 * 24 },
      }),
      // secret: process.env.JWT_SECRET,
      // signOptions: {
      //   expiresIn: 60 * 60 * 24, // expire in 1 day (24 hours)
      // },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PaginationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserSubscriber, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
