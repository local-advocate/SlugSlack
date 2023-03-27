import { Query, Resolver, Mutation, Args, Arg, Authorized, Ctx } from "type-graphql"
import type { NextApiRequest } from 'next'
import { FullMessage, Message, MessageArgs } from "./schema"
import { MessageService } from "./service"

@Resolver()
export class MessageResolver {
  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => [FullMessage])
  async message(
    @Args() { cid }: MessageArgs,
    @Ctx() req: NextApiRequest
  ): Promise<FullMessage[]> {
    return new MessageService().list(cid, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => FullMessage)
  async addMessage(
    @Args() { cid }: MessageArgs,
    @Arg("input") msg: Message,
    @Ctx() req: NextApiRequest
  ): Promise<FullMessage> {
    return new MessageService().add(cid, msg.message, req.user.name, req.user.id);
  }

  // @Authorized("member")
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @Mutation(returns => String)
  // async updateMessage(
  //   @Args() { cid, mid }: UpdateMSArgs,
  //   @Arg("input") msg: Message,
  //   @Ctx() req: NextApiRequest
  // ): Promise<string> {
  //   return new MessageService().update(cid, mid, msg.message, req.user.id);
  // }

  // @Authorized("member")
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @Mutation(returns => String)
  // async deleteMessage(
  //   @Args() { cid, mid }: UpdateMSArgs,
  //   @Ctx() req: NextApiRequest
  // ): Promise<string> {
  //   return new MessageService().delete(cid, mid, req.user.id);
  // }
}
