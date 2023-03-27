import { Field, ArgsType, ObjectType, InputType } from "type-graphql"
import { Matches, MaxLength, MinLength } from "class-validator";

const maxCHLength = 15;

@ObjectType()
export class Channel {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
  @MaxLength(maxCHLength)
  @MinLength(1)
    name!: string
  @Field()
    def!: boolean
}

@ArgsType()
export class ChannelArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    wid!: string 
}

@InputType('CreateCHInput')
export class CreateCHInput {
  @MaxLength(maxCHLength)
  @MinLength(1)
  @Field()
    name!: string 
  @Field()
    def!: boolean 
}

@ArgsType()
export class AccessCHArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    wid!: string 
  @Field()
    uid!: string 
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    cid!: string 
  @Field()
    access!: boolean 
}

@ArgsType()
export class DeleteCHArgs {
    @Field()
    @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
      cid!: string 
    @Field()
    @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
      wid!: string 
}