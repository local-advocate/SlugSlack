import { User, UserInput } from "./schema";
import { pool } from '../db';
import * as bcrypt from "bcrypt";

export class UserService {
  public async signup(user: UserInput): Promise<User> {
    const insertUser = {
      email: user.email,
      hash: bcrypt.hashSync(user.password, 10),
      name: user.name,
      roles: ["member"]
    } 
    // Create user and return User
    const insert = 'WITH res AS ' +
     '(INSERT INTO people(people)' +
     ' VALUES (\'' + JSON.stringify(insertUser) + '\')' +
     ' RETURNING user_id, people) ' +
     'SELECT (people::jsonb -\'hash\' || jsonb_build_object(\'id\', user_id)) people FROM res';
    const query = {
      text: insert,
      values: [],
    };
    const {rows} = await pool.query(query);
    return rows[0].people;
  }
}
