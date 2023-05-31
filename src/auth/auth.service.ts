import {
  BadGatewayException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import * as bcrypt from 'bcrypt';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interfase';

@Injectable()
export class AuthService {
  // inject the repository from entity
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // private productServices: ProductsService,
    private jwtService: JwtService,
  ) {}

  // Get all users
  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //   sing-up user
  async signupUser(authSignupDto: AuthSignupDto): Promise<User> {
    try {
      const { email, password } = authSignupDto;

      const userData = await this.userRepository.findOne({
        where: { email },
      });
      if (userData) {
        throw new ConflictException('User already exists');
      }
      // hash the password
      authSignupDto.password = await bcrypt.hash(password, 10);

      return await this.userRepository.save(authSignupDto);
    } catch (error) {
      // server error  exception
      throw new InternalServerErrorException(error);
    }
  }

  //   sing-in user
  async signInUser(
    authSignInDto: AuthSignInDto,
  ): Promise<accessTokenPayloadDTO> {
    try {
      const { email, password } = authSignInDto;

      const userData = await this.userRepository.findOne({ where: { email } });
      if (!userData) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // compare the password
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // generate token
      const payload: JwtPayload = {
        username: userData.username,
        role: userData.role,
      };

      const token = await this.jwtService.sign(payload);

      return {
        user: userData,
        accessToken: token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
