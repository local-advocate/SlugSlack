import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let at1: string | undefined;
let wid: string | undefined;
let cid: string | undefined;
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

const chname = 'ChannelTest';

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

test('Get All (0) Messages', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {message(cid: "${cid}") {id from time message}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.message).toBeDefined();
      expect(data.body.data.message.length).toEqual(0);
    });
});

test('Create Multiple Message OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addMessage(cid: "${cid}", input:{message:"MyMessage"}) {id, from, time, message}}`})
    .expect(200)
});

test('Get Multiple Messages', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {message(cid: "${cid}") {id from time message}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.message).toBeDefined();
      expect(data.body.data.message.length).toEqual(3);
      expect(data.body.data.message[0].id).toBeDefined();
      expect(data.body.data.message[0].from).toBeDefined();
      expect(data.body.data.message[0].message).toBeDefined();
      expect(data.body.data.message[0].time).toBeDefined();
    });
});

test('Get Messages (0), Channel DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {message(cid: "${ghost}") {id from time message}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.message.length).toEqual(0);
    });
});
