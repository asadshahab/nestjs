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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.entity';
import { AuthSignupDto, accessTokenPayloadDTO } from './dto/auth-singup.dto';
import { AuthSignInDto } from './dto/auth-singin.dto ';
import { AuthGuard } from '@nestjs/passport';
import { classToPlain, plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get all users
  @Get('/')
  @UseGuards(AuthGuard())
  async getUsers(@Req() req): Promise<User[]> {
    console.log(req.user);
    return await this.authService.getUsers();
  }

  //   sing-up user
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signupUser(@Body() authSignupDto: AuthSignupDto): Promise<User> {
    return await this.authService.signupUser(authSignupDto);
  }

  //   sing-in user
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signInUser(
    @Body() authSignInDto: AuthSignInDto,
  ): Promise<accessTokenPayloadDTO> {
    const { user, accessToken } = await this.authService.signInUser(
      authSignInDto,
    );
    return { user, accessToken };
  }
}
