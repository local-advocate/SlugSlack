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
let cid: string | undefined;
const uid = 'user4444@gmail.com';

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  request = supertest(server);
  await db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

test('Initialization OK', async () => {
  at1 = await login.asTest1(request);
  at4 = await login.asTest4(request);
})

const name = 'WSMSGName';

test('Create Workspace', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      wid = data.body.data.addWorkspace.id;
    });
});

const chname = 'CHTest5';

test('Create Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"${chname}",def:true}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid = data.body.data.addChannel.id;
    });
});

test('Create Message OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.addMessage).toBeDefined();
      expect(data.body.data.addMessage.id).toBeDefined();
      expect(data.body.data.addMessage.from).toEqual('Test User 1');
      expect(data.body.data.addMessage.time).toBeDefined();
      expect(data.body.data.addMessage.message).toBeDefined();
    });
});

test('Create Duplicate OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
});

test('No Access/Channel DNE Create', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
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

test('Access Given Create', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect('Content-Type', /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.data.addMessage).toBeDefined();
      expect(data.body.data.addMessage.id).toBeDefined();
      expect(data.body.data.addMessage.from).toEqual('Test User 4');
      expect(data.body.data.addMessage.time).toBeDefined();
      expect(data.body.data.addMessage.message).toBeDefined();
    });
});

test('Create Non-default Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"NonDefCH",def:false}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid = data.body.data.addChannel.id;
    });
});

test('Non default Create Message CH DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Give Access OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid}",uid:"${uid}",access:true)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.accessCH).toBeDefined();
    });
});

test('Non default Access Given Create CH OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.addMessage).toBeDefined();
      expect(data.body.data.addMessage.id).toBeDefined();
      expect(data.body.data.addMessage.from).toEqual('Test User 4');
      expect(data.body.data.addMessage.time).toBeDefined();
      expect(data.body.data.addMessage.message).toBeDefined();
    });
});

test('Create Minimum Length Violation', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:""}) {id, from, time, message}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
