import { Query, Resolver, Args } from "type-graphql"

import { Credentials, AuthUser } from "./schema"
import { AuthService } from "./service"

@Resolver()
export class AuthResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query(returns => AuthUser)
  async login(
    @Args() credentials: Credentials,
  ): Promise<AuthUser|undefined> {
    return new AuthService().login(credentials);
  }
}