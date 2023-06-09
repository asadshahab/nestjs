import { AuthenticationError } from '@nestjs/apollo';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '.././user.service';
import { UserConstant } from '../../utils/constants/message-constants';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx.req.headers.authorization) {
      return false;
    }
    const token = this.extractToken(ctx.req.headers.authorization);
    if (!token) {
      throw new UnauthorizedException(UserConstant.invalidToken);
    }
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new AuthenticationError(UserConstant.userNotFound);
    }
    ctx.user = user; 

    return true;
  }
  extractToken(authHeader: string): string | null {
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }
    return token;
  }
}
