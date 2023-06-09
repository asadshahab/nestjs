import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from '../user.service';
import { AuthSignupDto } from '../dto/auth-singup.dto';
import { AuthSignInDto } from '../dto/auth-singin.dto ';
import { AuthSingInResponsePayload } from '../dto/auth-singin-response.dto';
import { MessageConstant } from '../../utils/constants/user-message-constants';
import { User } from '../user.entity';
import { HttpStatus } from '@nestjs/common';

@Resolver(User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthSingInResponsePayload)
  async signupUser(@Args('authSignupDto') authSignupDto: AuthSignupDto): Promise<AuthSingInResponsePayload> {
    const user = await this.authService.signupUser(authSignupDto);
    return { response: { status: HttpStatus.CREATED, message: MessageConstant.userCreated }, user };
  }

  @Mutation(() => AuthSingInResponsePayload)
  async signInUser(@Args('authSignInDto') authSignInDto: AuthSignInDto): Promise<AuthSingInResponsePayload> {
    const { user, accessToken } = await this.authService.signInUser(authSignInDto);
    return { response: { status: HttpStatus.OK, message: MessageConstant.login }, user, accessToken };
  }
}
