import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let at1: string | undefined;
let at4: string | undefined;
let wid: string | undefined;
const uid = 'user4444@gmail.com';
const ghost = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  request = supertest(server);
  await db.reset();
  return new Promise(resolve => setTimeout(resolve, 500));
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('Initialization OK', async () => {
  at1 = await login.asTest1(request);
  at4 = await login.asTest4(request);
})

const name = 'WSTestSpace';

test('Create OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      wid = data.body.data.addWorkspace.id;
    });
});

test('Invite User OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {inviteUser(uid: "${uid}", wid: "${wid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.inviteUser).toBeDefined();
    });
});

test('Accept Invitation OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {invitationUpdate(wid:"${wid}", accept: true)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.invitationUpdate).toBeDefined();
    });
});

test('Invite Again OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {inviteUser(uid: "${uid}", wid: "${wid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.inviteUser).toBeDefined();
    });
});

test('Revoke Access OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {revoke(uid: "${uid}", wid:"${wid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.revoke).toBeDefined();
    });
});

test('Get All, Check access and invitation', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {workspace {
          invitedTo {id name}
          accessTo {id name}
      }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.workspace.invitedTo.length).toEqual(0);
      expect(data.body.data.workspace.accessTo.length).toEqual(0);
    });
});

test('Revoke Access Workspace DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {revoke(uid: "${uid}", wid:"${ghost}")}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Revoke Access User DNE OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {revoke(uid: "${ghost}", wid:"${wid}")}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body)
      expect(data.body.errors.length).toEqual(1);
    });
});
