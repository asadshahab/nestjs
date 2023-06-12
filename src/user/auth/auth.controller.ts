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
import { UserConstant } from '../../utils/constants/message-constants';
// import { PaginationResponse } from '../../utils/common/dto/pagination-response';
import { User } from '../user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @description get all users
   * @param req
   * @returns return all users
   */
  // @Get('/view')
  // // @UseGuards(AuthGuard())
  // // async getUsers(
  // //   @Req() req,
  // //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  // //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  // // ): Promise<PaginationResponse<User>> {
  // //   const usersData = await this.authService.paginate({
  // //     page,
  // //     limit,
  // //   });
  // //   return { response: { status: HttpStatus.OK, message: MessageConstant.userRetrieved }, data: usersData };
  // // }

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
