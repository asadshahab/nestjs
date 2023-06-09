import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { User } from '../../../user/user.entity';

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): User => {
  const gqlCtx = GqlExecutionContext.create(context).getContext();
  return gqlCtx.user as User;
});
