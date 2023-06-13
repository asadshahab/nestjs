import {
  Get,
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Query
} from '@nestjs/common';
import { AuthService } from '../user.service';
import { AuthSignupDto } from '../dto/auth-singup.dto';
import { AuthSignInDto } from '../dto/auth-singin.dto ';
import { AuthSingInResponsePayload } from '../dto/auth-singin-response.dto';
import { UserConstant } from '../../utils/constants/message-constants';
import { User } from '../user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import PaginationPayloadInterface from '../../pagination/dto/pagination-payload-interface.dto';
import { PaginationService } from '../../pagination/pagination.service';

@Controller('user')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly paginationService: PaginationService) {}

   /**
   * Get all users with pagination
   * @param page Current page number
   * @param limit Number of records per page
   * @returns Paginated response of users
   */
   @Get('/view')
   async getUsers(
     @Query('page') page: number, @Query('limit') limit: number): Promise<PaginationPayloadInterface<User>> {
     return this.authService.paginateUser(page, limit);
   }
  /**
   * @description sign-up user
   * @param authSignupDto
   * @returns return the user created
   */
  @Post('/signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Signup' })
  async signupUser(@Body() authSignupDto: AuthSignupDto): Promise<AuthSingInResponsePayload> {
    const user = await this.authService.signupUser(authSignupDto);
    return { response: { status: HttpStatus.CREATED, message: UserConstant.userCreated }, user };
  }

  /**
   * @description sign-in user
   * @param authSignInDto
   * @returns return the user logged in
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signin')
  @ApiOperation({ summary: 'Login' })
  @UsePipes(ValidationPipe)
  async signInUser(@Body() authSignInDto: AuthSignInDto): Promise<AuthSingInResponsePayload> {
    const { user, accessToken } = await this.authService.signInUser(authSignInDto);
    return { response: { status: HttpStatus.OK, message: UserConstant.login }, user, accessToken };
  }
}
