import { Field, ObjectType, ArgsType } from "type-graphql"
import { Matches, MaxLength, MinLength } from "class-validator";

const maxWSName = 30;

@ObjectType()
export class Workspace {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
  @MinLength(1)
  @MaxLength(maxWSName)
    name!: string
}

@ObjectType()
export class WSList {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => [Workspace])
    owner!: Workspace[]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => [Workspace])
    accessTo!: Workspace[]
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field(type => [Workspace])
    invitedTo!: Workspace[]
}

@ArgsType()
export class InviteWSArgs {
  @Field()
    uid!: string 
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    wid!: string 
}

@ArgsType()
export class InvitationArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    wid!: string 
  @Field()
    accept!: boolean 
}

@ArgsType()
export class DeleteWSArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    wid!: string 
}