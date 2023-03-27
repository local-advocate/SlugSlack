import { Query, Resolver, Mutation, Args, Arg, Authorized, Ctx } from "type-graphql"
import type { NextApiRequest } from 'next'
import { Channel, ChannelArgs, CreateCHInput, AccessCHArgs, DeleteCHArgs } from "./schema"
import { ChannelService } from "./service"

@Resolver()
export class ChannelResolver {
  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => [Channel])
  async channel(
    @Args() { wid }: ChannelArgs,
    @Ctx() req: NextApiRequest
  ): Promise<Channel[]> {
    return new ChannelService().list(wid, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => Channel)
  async addChannel(
    @Args() { wid }: ChannelArgs,
    @Arg("input") ch: CreateCHInput,
    @Ctx() req: NextApiRequest
  ): Promise<Channel> {
    return new ChannelService().add(wid, ch, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async accessCH(
    @Args() { wid, cid, uid, access }: AccessCHArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new ChannelService().accessUpdate(wid, cid, uid, access, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async deleteCH(
    @Args() { wid, cid }: DeleteCHArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new ChannelService().delete(wid, cid, req.user.id);
  }
}
