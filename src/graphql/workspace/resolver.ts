import { Query, Resolver, Mutation, Args, Arg, Authorized, Ctx } from "type-graphql"
import { DeleteWSArgs, InvitationArgs, InviteWSArgs, Workspace, WSList } from "./schema"
import { WorkspaceService } from "./service"
import type { NextApiRequest } from 'next'

@Resolver()
export class WorkspaceResolver {
  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => WSList)
  async workspace(
    @Ctx() req: NextApiRequest
  ): Promise<WSList> {
    return new WorkspaceService().list(req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => Workspace)
  async addWorkspace(
    @Arg("name") name: string,
    @Ctx() req: NextApiRequest
  ): Promise<Workspace> {
    return new WorkspaceService().add(name, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async inviteUser(
    @Args() { uid, wid }: InviteWSArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new WorkspaceService().invite(uid, wid, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async invitationUpdate(
    @Args() { wid, accept }: InvitationArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new WorkspaceService().invitationUpdate(wid, accept, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async revoke(
    @Args() { wid, uid }: InviteWSArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new WorkspaceService().revoke(uid, wid, req.user.id);
  }

  @Authorized("member")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => String)
  async deleteWorkspace(
    @Args() { wid }: DeleteWSArgs,
    @Ctx() req: NextApiRequest
  ): Promise<string> {
    return new WorkspaceService().delete(wid, req.user.id);
  }
}
