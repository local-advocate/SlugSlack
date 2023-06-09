import { Field, ObjectType, ArgsType } from "type-graphql"
import { Length, Matches } from "class-validator";

@ArgsType()
export class Credentials {
    @Field()
    @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      email!: string
    @Field()
    @Length(8, 16)
      password!: string
}

@ObjectType()
export class AuthUser {
    @Field()
      name!: string
    @Field()
      accessToken!: string
}
