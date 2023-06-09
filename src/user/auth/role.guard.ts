import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // const request = context.switchToHttp().getRequest();
    const ctx = GqlExecutionContext.create(context).getContext();
    const user = ctx.user;
    return this.matchRoles(roles, user.role);
  }

  matchRoles(roles: string[], userRoles: string) {
    return roles.some((role) => userRoles.includes(role));
  }
}
