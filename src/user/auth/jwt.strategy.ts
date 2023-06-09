import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../user.entity';
import { JwtPayload } from './jwt-payload.interfase';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: AuthService, private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract the token from the header
      secretOrKey: configService.get('JWT_SECRET'), // the secret key
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
