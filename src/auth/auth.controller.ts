import {
  Get,
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './auth.entity';
import { AuthSignupDto } from './dto/auth-singup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Get all users
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.authService.getUsers();
  }

  //   sing-up user
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signupUser(@Body() authSignupDto: AuthSignupDto): Promise<User> {
    return await this.authService.signupUser(authSignupDto);
  }
}
