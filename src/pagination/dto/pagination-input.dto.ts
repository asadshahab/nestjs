import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"

@InputType()
export class PaginationInputInterface {

  @Field(() => Int)
  page: number

  @Field(() => Int)
  limit: number
}

