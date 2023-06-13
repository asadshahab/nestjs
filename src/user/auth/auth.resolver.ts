import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { AuthService } from '../user.service';
import { AuthSignupDto } from '../dto/auth-singup.dto';
import { AuthSignInDto } from '../dto/auth-singin.dto ';
import { AuthSingInResponsePayload } from '../dto/auth-singin-response.dto';
import { UserConstant } from '../../utils/constants/message-constants';
import { User } from '../user.entity';
import { HttpStatus } from '@nestjs/common';
import PaginationPayloadInterface from 'src/pagination/dto/pagination-payload-interface.dto';
import { AuthPaginationResponse } from '../dto/auth-pagination.dto';

@Resolver(User)
export class AuthResolver {
  constructor(private authService: AuthService) {}


  @Query(() => AuthPaginationResponse)
  async findAllUsers(@Args('page',{type: ()=> Int}) page: number, @Args('limit', {type: ()=> Int}) limit: number): Promise<AuthPaginationResponse> {
    console.log('page', page);
    const data =  await this.authService.paginateUser(page, limit);
    return data;
  }

  @Mutation(() => AuthSingInResponsePayload)
  async signupUser(@Args('authSignupDto') authSignupDto: AuthSignupDto): Promise<AuthSingInResponsePayload> {
    const user = await this.authService.signupUser(authSignupDto);
    return { response: { status: HttpStatus.CREATED, message: UserConstant.userCreated }, user };
  }

  @Mutation(() => AuthSingInResponsePayload)
  async signInUser(@Args('authSignInDto') authSignInDto: AuthSignInDto): Promise<AuthSingInResponsePayload> {
    const { user, accessToken } = await this.authService.signInUser(authSignInDto);
    return { response: { status: HttpStatus.OK, message: UserConstant.login }, user, accessToken };
  }
}
