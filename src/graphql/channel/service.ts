import { CommonService } from "../common";
import { Channel, CreateCHInput } from "./schema";
import { pool } from '../db';

export class ChannelService {
  public async list(wid: string, id: string): Promise<Channel[]>  {
    const select = 
      'SELECT (channel::jsonb || jsonb_build_object(\'id\', channel.ch_id))' +
      ' channel FROM channel WHERE ch_id IN ' +
      '(SELECT ch_id FROM chuser WHERE (user_id = $1 AND ws_id = $2))';
    const query = {
      text: select,
      values: [`${id}`, `${wid}`]
    };
    const {rows} = await pool.query(query);
    const channels : Channel[] = [];
    for (const row of rows) {
      channels.push(row.channel);
    }
    return channels;
  }

  public async add(wid: string, ch: CreateCHInput, id: string): Promise<Channel>  {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // insert
    let insert = 'INSERT INTO channel(ws_id, channel) VALUES ($1, $2) RETURNING ch_id';
    let query = {
      text: insert,
      values: [`${wid}`, JSON.stringify(ch)],
    };
    const {rows} = await pool.query(query);

    // owner has access to all
    insert = 'INSERT INTO chuser(ch_id, ws_id, user_id) VALUES ($1, $2, $3)';
    query = {
      text: insert,
      values: [`${rows[0].ch_id}`, `${wid}`, `${id}`],
    };
    await pool.query(query);

    return {id: rows[0].ch_id, name: ch.name, def: ch.def};
  }

  public async accessUpdate(wid: string, cid: string, uid: string, access: boolean, id: string): Promise<string>  {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // checking for workspace access doesnt matter
    // wont be able to do anything

    // check user exists
    // check user
    const exists: boolean | string = await new CommonService().checkUser(uid);
    if (exists === false) throw new Error('User not found');
    const actualID: string | boolean = exists;

    // update access
    if (access) {
      const insert = 'INSERT INTO chuser(ch_id, ws_id, user_id) VALUES ($1, $2, $3)';
      const query = {
        text: insert,
        values: [`${cid}`, `${wid}`, `${actualID}`],
      };
      await pool.query(query);
      return 'Channel access given!'
    } else {
      const del = 'DELETE FROM chuser WHERE (user_id = $1 AND ch_id = $2)';
      const query = {
        text: del,
        values: [`${actualID}`, `${cid}`],
      };
      await pool.query(query);
      return 'Channel access revoked'
    }
  }

  public async delete(wid: string, cid: string, id: string): Promise<string> {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // delete
    const del = 'DELETE FROM channel WHERE (ch_id = $1 AND ws_id = $2)';
    const query = {text: del, values: [`${cid}`, `${wid}`]};
    await pool.query(query);

    return 'Channel deleted';
  }
}
