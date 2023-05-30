import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interfase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // inject the repository from entity
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract the token from the header
      secretOrKey: 'topSecret51', // the secret key
    });
  }

  //   validate the user
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
