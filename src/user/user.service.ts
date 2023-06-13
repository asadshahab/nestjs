import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth/jwt-payload.interfase';
import { HashPassword } from '../utils/common/hash-password';
import { UserConstant } from '../utils/constants/message-constants';
import PaginationPayloadInterface from '../pagination/dto/pagination-payload-interface.dto';
import { PaginationService } from '../pagination/pagination.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly paginationService: PaginationService
  ) {}

  /**
   * @description Paginate all users
   * @param options
   * @returns all users
   * @returns pagination
   * @returns total users
   */

  async paginateUser(page:number, limit:number): Promise<PaginationPayloadInterface<User>> {
    return this.paginationService.paginate<User>(this.userRepository, page, limit);
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
        throw new ConflictException(UserConstant.userAlreadyExists);
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
        throw new NotFoundException(UserConstant.userNotFound);
      }

      // compare the password
      const isMatch = await HashPassword.compare(password, userData.password);
      if (!isMatch) {
        throw new UnauthorizedException(UserConstant.invalidCredentials);
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

  /**
   * @description validate token
   * @param token
   * @returns the user
    */

  async validateToken(token: string) {
    const tokenPayload = this.jwtService.verify(token);
    const user = await this.getUser(tokenPayload.id);
    return user;
  }
}
