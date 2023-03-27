import { Field, ObjectType, InputType } from "type-graphql"
import { Matches, ArrayMaxSize, MaxLength, MinLength} from "class-validator";

const maxRoles = 2;
const maxRoleLength = 10;
const maxUserName = 50;

@ObjectType()
export class User {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
  @Matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    email!: string
  @Field()
  @MaxLength(maxUserName)
  @MinLength(1)
    name!: string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => [String])
  @ArrayMaxSize(maxRoles)
  @MaxLength(maxRoleLength, {each: true})
    roles!: string[]
}

@InputType('UserInput')
export class UserInput {
  @Field()
  @Matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
    email!: string
  @Field()
    password!: string
  @Field()
    name!: string
}
