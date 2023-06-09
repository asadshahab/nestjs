import { AuthenticationError } from '@nestjs/apollo';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '.././user.service';

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
      throw new UnauthorizedException('Invalid token');
    }
    const user = await this.userService.validateToken(token);
    if (!user) {
      throw new AuthenticationError('Invalid User');
    }

    console.log('---------user', user);

    ctx.user = user; // Set the user object in the context

    return true;
  }

  // async handleRequest(auth: string) {
  //   const [bearer, token] = auth.split(' ');
  //   if (bearer !== 'Bearer' && !token) {
  //     throw new UnauthorizedException('Invalid token');
  //   }

  //   const user = await this.userService.validateToken(token);

  //   if (!user) {
  //     throw new AuthenticationError('Invalid User');
  //   }

  //   return user;
  // }

  extractToken(authHeader: string): string | null {
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }
    return token;
  }
}
