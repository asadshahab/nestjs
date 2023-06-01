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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';
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
  async getUsers(@Req() req): Promise<AuthResponsePayload> {
    const users = await this.authService.getUsers();
    const response = {
      status: HttpStatus.OK,
      message: 'Users retrieved successfully',
    };
    return { response, data: users };
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
    const response = {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
    };
    return { response, data: user };
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
    const response = {
      status: HttpStatus.OK,
      message: 'User logged in successfully',
    };
    return { response, data: user, accessToken };
  }
}
