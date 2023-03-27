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

const chname = 'CHTest1';

test('Create Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"${chname}",def:false}) {id, name, def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      cid = data.body.data.addChannel.id;
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

test('Get One Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(1);
      expect(data.body.data.channel[0].id).toEqual(cid);
      expect(data.body.data.channel[0].name).toEqual(chname);
      expect(data.body.data.channel[0].def).toBeFalsy();
    });
});

test('Give Access Again Error', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid}",uid:"${uid}",access:true)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Revoke Access OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid}",uid:"${uid}",access:false)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.accessCH).toBeDefined();
    });
});

test('Get Zero Channel OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(0);
    });
});

test('Revoke Access Again OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid}",uid:"${uid}",access:false)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.accessCH).toBeDefined();
    });
});

test('Give Access Workspace DNE/Non-owner', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${ghost}",cid:"${cid}",uid:"${uid}",access:true)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Give Access Channel DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${ghost}",uid:"${uid}",access:true)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Give Access User DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {accessCH(wid:"${wid}",cid:"${cid}",uid:"${ghost}",access:true)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
