import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';


let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let at1: string | undefined;
let at4: string | undefined;
const uid = 'user4444@gmail.com';
let wid: string | undefined;
const cid: string[] = [];

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
});

const name = 'WSExpName';

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
  
test('Create Channels OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"DCH1",def:true}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid[0] = data.body.data.addChannel.id;
    });
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"DCH2",def:false}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid[1] = data.body.data.addChannel.id;
    });
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"DCH3",def:true}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid[2] = data.body.data.addChannel.id;
    });
});

test('Delete Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${wid}", cid: "${cid[2]}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.deleteCH).toBeDefined();
    });
});

test('Get Two Channels OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(2);
    });
});

test('Invite User', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {inviteUser(uid: "${uid}", wid: "${wid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.inviteUser).toBeDefined();
    });
});

test('Accept Invitation', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {invitationUpdate(wid:"${wid}", accept: true)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.invitationUpdate).toBeDefined();
    });
});

test('Delete Default Channel', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${wid}", cid: "${cid[0]}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.deleteCH).toBeDefined();
    });
});

test('Get (0) Channels', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(0);
    });
});

test('Give Access', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid[1]}",uid:"${uid}",access:true)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.accessCH).toBeDefined();
    });
});

test('Delete Non-Default Channel', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${wid}", cid: "${cid[1]}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.deleteCH).toBeDefined();
    });
});

test('Get (0) Channels', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(0);
    });
});

test('Delete Twice OK/Channel DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${wid}", cid: "${cid[1]}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.deleteCH).toBeDefined();
    });
});

test('Delete Channel Workspace DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${cid[0]}", cid: "${cid[2]}")}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

let tempcid: string;
test('Create Temp Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"TEMPCHTEMPCH",def:true}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      tempcid = data.body.data.addChannel.id;
    });
});

// test('Create Multiple Messages', async () => {
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + at1)
//     .send({query: `mutation {addMessage(cid: "${tempcid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
//     .expect(200)
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + at1)
//     .send({query: `mutation {addMessage(cid: "${tempcid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
//     .expect(200)
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + at1)
//     .send({query: `mutation {addMessage(cid: "${tempcid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
//     .expect(200)
// });

test('Delete Temp Channel', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {deleteCH(wid:"${wid}", cid: "${tempcid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.deleteCH).toBeDefined();
    });
});

// test('Get (0) Messages in TempCH', async () => {
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + at1)
//     .send({query: `query {message(cid: "${tempcid}") {id from time message}}`})
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then((data) => {
//       expect(data).toBeDefined();
//       expect(data.body).toBeDefined();
//       expect(data.body.data).toBeDefined();
//       expect(data.body.data.message).toBeDefined();
//       expect(data.body.data.message.length).toEqual(0);
//     });
// });