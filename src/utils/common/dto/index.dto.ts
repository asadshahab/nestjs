import { HttpStatus } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Response {
  @Field()
  name?: string;

  @Field(() => Int)
  status: number;

  @Field()
  error?: string;

  @Field()
  message: string;
}

@ObjectType()
export class ResponsePayload {
  @Field(() => Response)
  response?: Response;
}
