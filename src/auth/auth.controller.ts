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
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponsePayload } from './dto/auth-response.dto';
import { AuthSingInResponsePayload } from './dto/auth-singin-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @description get all users
   * @param req
   * @returns return all users
   */
  @Get('/')
  @UseGuards(AuthGuard())
  async getUsers(@Req() req, @Query() query: { skip: number; take: number }): Promise<AuthResponsePayload> {
    const users = await this.authService.getUsers(query);
    return { response: { status: HttpStatus.FOUND, message: 'Users retrieved successfully' }, data: users };
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
    return { response: { status: HttpStatus.CREATED, message: 'user created successfully' }, data: user };
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
    return { response: { status: HttpStatus.OK, message: 'user logged in successfully' }, data: user, accessToken };
  }
}
