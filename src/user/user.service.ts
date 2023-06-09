import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth/jwt-payload.interfase';
import { HashPassword } from '../utils/common/hash-password';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { MessageConstant } from '../utils/constants/user-message-constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * @description Paginate all users
   * @param options
   * @returns all users
   * @returns pagination
   * @returns total users
   */

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  /**
   * @description get one user
   * @param email
   * @returns one user
   */
  async getUser(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
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
      const { email } = authSignupDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        throw new ConflictException('User already exists');
      }
      const userData = this.userRepository.create(authSignupDto);

      return await userData.save();
    } catch (error) {
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

      const userData = await this.userRepository.findOne({ where: { email } });
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
        id: userData.id,
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

  // validate user

  async validateToken(token: string) {
    const secret = this.jwtService.verify(token);
    const user = await this.getUser(secret.id);
    // const roles = await this.userRoleService.findRolesByUserId(user?.id);
    // const strRoles = roles.map(({ type }) => type);
    // { roles: strRoles, user: user, secret };

    return user;
  }
}
