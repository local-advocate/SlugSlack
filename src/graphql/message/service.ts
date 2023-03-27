import { CommonService } from "../common";
import { FullMessage } from "./schema";
import { pool } from '../db';

export class MessageService {
  public async list(cid: string, id: string): Promise<FullMessage[]>  {
    // get all if has access to it
    const select = 
    'SELECT (message::jsonb || jsonb_build_object(\'id\', message.ms_id))' +
    ' message FROM message WHERE ch_id IN' +
    '(SELECT ch_id FROM chuser WHERE (ch_id = $1 AND user_id = $2))';
    const query = {
      text: select,
      values: [`${cid}`, `${id}`]
    };
    const {rows} = await pool.query(query);
    const messages : FullMessage[] = [];
    for (const row of rows) {
      messages.push(row.message);
    }
    return messages;
  }

  public async add(cid: string, msg: string, name: string, id: string): Promise<FullMessage>  {
    // check access
    const access: boolean = await new CommonService().hasAccCH(id, cid);
    if (!access) throw new Error('Channel not found');

    const message: FullMessage = {
      id: 'none',
      message: msg,
      time: new Date().toLocaleString('en-US', { weekday:'long', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'}),
      from: name
    };

    // Create Message
    const select = 'INSERT INTO message(ch_id, user_id, message) VALUES ($1, $2, $3) RETURNING ms_id';
    const query = {
      text: select,
      values: [`${cid}`,`${id}`, JSON.stringify(message)]
    };
    const {rows} = await pool.query(query);
    message.id = rows[0].ms_id;
    return message;
  }

  // public async update(cid: string, mid: string, msg: string, id: string): Promise<string>  {
  //   // check access
  //   const access: boolean = await new CommonService().hasAccCH(id, cid);
  //   if (!access) throw new Error('Not found');

  //   // update message if exists
  //   const update = 'UPDATE message SET message = jsonb_set(message, \'{message}\', $1) WHERE (ms_id = $2 AND user_id = $3)';
  //   const query = {
  //     text: update,
  //     values: [JSON.stringify(msg),`${mid}`,`${id}`]
  //   };
  //   await pool.query(query);

  //   return 'Message updated!';
  // }

  // public async delete(cid: string, mid: string, id: string): Promise<string>  {
  //   // check access
  //   const access: boolean = await new CommonService().hasAccCH(id, cid);
  //   if (!access) throw new Error('Not found');

  //   // delete message if exists
  //   const del = 'DELETE FROM message WHERE (ms_id = $1 AND user_id = $2)';
  //   const query = {
  //     text: del,
  //     values: [`${mid}`,`${id}`]
  //   };
  //   await pool.query(query);

  //   return 'Message deleted';
  // }
}
