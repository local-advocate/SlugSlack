import { Field, ArgsType, ObjectType, InputType } from "type-graphql"
import { Matches, MaxLength, MinLength } from "class-validator";

const maxMSLength = 1500;

@InputType()
export class Message {
  @Field()
  @MaxLength(maxMSLength)
  @MinLength(1)
    message!: string 
}

@ArgsType()
export class MessageArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    cid!: string 
}

@ObjectType()
export class FullMessage {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
    from!: string
  @Field()
    time!: string
  @Field()
  @MaxLength(maxMSLength)
  @MinLength(1)
    message!: string
}

// @ArgsType()
// export class UpdateMSArgs {
//   @Field()
//   @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
//     cid!: string 
//   @Field()
//   @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
//     mid!: string 
// }
