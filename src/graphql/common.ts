import { pool } from './db';

export class CommonService {
  // check owner of workspace
  public async isWSOwner(uid: string, wid: string): Promise<boolean> {
    const select = 'SELECT ws_id from workspace WHERE (user_id = $1 and ws_id = $2)';
    const query = {text: select, values: [`${uid}`, `${wid}`]};
    const {rows} = await pool.query(query);
    if (rows.length === 0) return false;
    return true;
  }
  // check access to channel
  public async hasAccCH(uid: string, cid: string): Promise<boolean> {
    const select = 'SELECT ch_id from chuser WHERE (user_id = $1 and ch_id = $2)';
    const query = {text: select, values: [`${uid}`, `${cid}`]};
    const {rows} = await pool.query(query);
    if (rows.length === 0) return false;
    return true;
  }
  public async checkUser(email: string): Promise<boolean|string> {
    const select = 
      'SELECT user_id FROM people WHERE people->>\'email\' = $1';
    const query = {
      text: select,
      values: [`${email}`],
    };
    const {rows} = await pool.query(query);
    if (rows.length === 0) return false;
    return rows[0].user_id;
  }
}
