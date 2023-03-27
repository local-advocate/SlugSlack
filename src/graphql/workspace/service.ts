import { CommonService } from "../common";
import { Workspace, WSList } from "./schema";
import { pool } from '../db';

export class WorkspaceService {
  public async list(id: string): Promise<WSList>  {

    // owner
    let select = 'SELECT (workspace::jsonb ||' +
      ' jsonb_build_object(\'id\', workspace.ws_id))' +
      ' workspace FROM workspace WHERE user_id = $1';
    let query = {
      text: select,
      values: [`${id}`]
    };
    let {rows} = await pool.query(query);
    const owned : Workspace[] = [];
    for (const row of rows) {
      owned.push(row.workspace);
    }

    // access to
    select = 
     'SELECT (workspace::jsonb || jsonb_build_object(\'id\', workspace.ws_id))' +
     ' workspace FROM workspace WHERE ws_id IN ' +
     '(SELECT ws_id FROM wspuser WHERE user_id = $1)';
    query = {
      text: select,
      values: [`${id}`]
    };
    ({rows} = await pool.query(query));
    const accesTo : Workspace[] = [];
    for (const row of rows) {
      accesTo.push(row.workspace);
    }

    // invited to
    select = 
    'SELECT (workspace::jsonb || jsonb_build_object(\'id\', workspace.ws_id))' +
    ' workspace FROM workspace WHERE ws_id IN ' +
    '(SELECT ws_id FROM invitews WHERE user_id = $1)';
    query = {
      text: select,
      values: [`${id}`]
    };
    ({rows} = await pool.query(query));
    const invitedTo : Workspace[] = [];
    for (const row of rows) {
      invitedTo.push(row.workspace);
    }

    return {owner: owned, accessTo: accesTo, invitedTo: invitedTo};
  }

  public async add(name: string, id: string): Promise<Workspace>  {
    const insert = 'INSERT INTO workspace(user_id, workspace) VALUES ($1, $2) RETURNING ws_id';
    const query = {
      text: insert,
      values: [`${id}`, `{"name":"${name}"}`],
    };
    const {rows} = await pool.query(query);
    return {id: rows[0].ws_id, name: name};
  }

  public async invite(uid: string, wid: string, id: string): Promise<string>  {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // check user
    const exists: boolean | string = await new CommonService().checkUser(uid);
    if (exists === false) throw new Error('User not found');
    const actualID: string | boolean = exists;

    // invite
    const insert = 
      'INSERT INTO invitews(user_id, ws_id) VALUES ($1, $2)';
    const query = {
      text: insert,
      values: [`${actualID}`, `${wid}`],
    };
    await pool.query(query);
    return 'User Invited!';
  }

  public async invitationUpdate(wid: string, accept: boolean, id: string): Promise<string>  {
    // check invitation
    const select = 'SELECT ws_id from invitews WHERE (user_id = $1 and ws_id = $2)';
    let query = {text: select, values: [`${id}`, `${wid}`]};
    let {rows} = await pool.query(query);
    if (rows.length === 0) throw new Error('Invitation not found');

    // invite
    // remove the invitation (accept or decline)
    const del = 
      'DELETE FROM invitews WHERE (user_id = $1 and ws_id = $2)';
    query = {text: del, values: [`${id}`, `${wid}`]};
    await pool.query(query);
    if (accept) {
      // add to access table
      let insert = 'INSERT INTO wspuser(user_id, ws_id) VALUES ($1, $2)';
      query = {text: insert, values: [`${id}`, `${wid}`]};
      await pool.query(query);
        
      // give access to default channels
      // awkward but could not figure out combination of sql command
      const select = 'SELECT ch_id FROM channel WHERE (ws_id = $1 AND (channel->>\'def\')::boolean)';
      query = {text: select, values: [`${wid}`]};
      ({rows} = await pool.query(query));
      for (const row of rows) {
        insert = 'INSERT INTO chuser(ch_id, ws_id, user_id) VALUES ($1, $2, $3)';
        query = {text: insert, values: [`${row.ch_id}`, `${wid}`, `${id}`]};
        await pool.query(query);
      }
      return 'Invitation Accepted!';
    } else {
      return 'Invitation Rejected';
    }
  }

  public async revoke(uid: string, wid: string, id: string): Promise<string>  {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // check user
    const exists: boolean | string = await new CommonService().checkUser(uid);
    if (exists === false) throw new Error('User not found');
    const actualID: string | boolean = exists;

    // remove access
    let del = 
      'DELETE FROM wspuser WHERE (user_id = $1 and ws_id = $2)';
    let query = {text: del, values: [`${actualID}`, `${wid}`]};
    await pool.query(query);

    // remove invitation (a possibility)
    del = 'DELETE FROM invitews WHERE (user_id = $1 and ws_id = $2)';
    query = {text: del, values: [`${actualID}`, `${wid}`]};
    await pool.query(query);

    return 'Access revoked';
  }

  public async delete(wid: string, id: string): Promise<string>  {
    // check owner
    const owner: boolean = await new CommonService().isWSOwner(id, wid);
    if (!owner) throw new Error('Workspace not found');

    // delete
    const del = 'DELETE FROM workspace WHERE ws_id = $1';
    const query = {
      text: del,
      values: [`${wid}`]
    };
    await pool.query(query);

    return 'Workspace deleted';
  }
}
