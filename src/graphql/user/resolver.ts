import { Resolver, Mutation, Arg } from "type-graphql"
import { User, UserInput } from "./schema"
import { UserService } from "./service"

@Resolver()
export class UserResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(returns => User)
  async signup(
    @Arg("input") input: UserInput,
  ): Promise<User> {
    return new UserService().signup(input);
  }
}
