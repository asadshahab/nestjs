import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export default class PaginationPayloadInterface<T> {

  @Field(() => Int)
  page: number

  @Field(() => Int)
  limit: number

  @Field(() => Int)
  totalCount: number

  @Field(() => Int)
  totalPages: number

  data: T[]
}

