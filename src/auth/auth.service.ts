import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interfase';
import { HashPassword } from 'src/common/hash-password';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @description get all users
   * @returns all users
   */
  async getUsers(query): Promise<User[]> {
    console.log(query);
    return await this.userRepository.find({
      skip: query.skip,
      take: query.take,
    });
  }

  /**
   * @description get one user
   * @param email
   * @returns one user
   */
  async getUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description sign-up user
   * @param authSignupDto
   * @returns the user created
   */
  async signupUser(authSignupDto: AuthSignupDto): Promise<User> {
    try {
      const { email, password } = authSignupDto;

      const user = await this.getUser(email);

      if (user) {
        throw new ConflictException('User already exists');
      }
      return await this.userRepository.save(authSignupDto);
    } catch (error) {
      // server error  exception
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description sign-in user
   * @param authSignInDto
   * @returns the user signed-in
   * @returns the access token
   */
  async signInUser(authSignInDto: AuthSignInDto): Promise<accessTokenPayloadDTO> {
    try {
      const { email, password } = authSignInDto;

      const userData = await this.getUser(email);
      if (!userData) {
        throw new NotFoundException('User not found');
      }

      // compare the password
      const isMatch = await HashPassword.compare(password, userData.password);
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
