import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { Credentials, AuthUser } from './schema';
import { SessionUser } from '../../types/custom';
import { pool } from '../db';

export class AuthService {
  public async login(credentials: Credentials): Promise<AuthUser|undefined>  {
    const select =
            'SELECT user_id, people FROM people WHERE people->>\'email\' = $1';
    const query = {
      text: select,
      values: [credentials.email],
    };
    const {rows} = await pool.query(query);
    const user = rows[0];
    return new Promise((resolve, reject) => {
      if (user !== undefined
            && bcrypt.compareSync(credentials.password, user.people.hash)) {
        const accessToken = jwt.sign(
          {id: user.user_id, roles: user.people.roles, name: user.people.name}, 
          `${process.env.SECRET}`, {
            expiresIn: '30m',
            algorithm: 'HS256'
          }
        );
        resolve({name: user.people.name, accessToken: accessToken});
      } else {
        reject(new Error("Unauthorised"));
      }
    });
  }

  public async check(authHeader?: string, roles?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"));
      }
      else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, `${process.env.SECRET}`, (error, user) => {
          const dec = user as SessionUser;
          if (error) {
            reject(error);
          } else if (roles) {
            for (const role of roles) {
              if (!dec.roles || !dec.roles.includes(role)) {
                reject(new Error("Unauthorised"));
              }
            }
          }
          resolve(dec);
        });
      }
    });
  }
}
