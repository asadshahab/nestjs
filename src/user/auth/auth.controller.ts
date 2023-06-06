import {
  Get,
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from '../user.service';
import { AuthSignupDto } from '../dto/auth-singup.dto';
import { AuthSignInDto } from '../dto/auth-singin.dto ';
import { AuthGuard } from '@nestjs/passport';
import { AuthSingInResponsePayload } from '../dto/auth-singin-response.dto';
import { MessageConstant } from '../../utils/constants/user-message-constants';
import { PaginationResponse } from '../../utils/common/dto/pagination-response';

@Controller('index')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @description get all users
   * @param req
   * @returns return all users
   */
  @Get('/view')
  @UseGuards(AuthGuard())
  async getUsers(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<PaginationResponse> {
    limit = limit > 100 ? 100 : limit;

    const usersData = await this.authService.paginate({
      page,
      limit,
    });
    return { response: { status: HttpStatus.OK, message: MessageConstant.userRetrieved }, data: usersData };
  }

  /**
   * @description sign-up user
   * @param authSignupDto
   * @returns return the user created
   */
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signupUser(@Body() authSignupDto: AuthSignupDto): Promise<AuthSingInResponsePayload> {
    const user = await this.authService.signupUser(authSignupDto);
    return { response: { status: HttpStatus.CREATED, message: MessageConstant.userCreated }, data: user };
  }

  /**
   * @description sign-in user
   * @param authSignInDto
   * @returns return the user logged in
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signInUser(@Body() authSignInDto: AuthSignInDto): Promise<AuthSingInResponsePayload> {
    const { user, accessToken } = await this.authService.signInUser(authSignInDto);
    return { response: { status: HttpStatus.OK, message: MessageConstant.login }, data: user, accessToken };
  }
}
