import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let at1: string | undefined;
let at4: string | undefined;

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

test('Admin: Post OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.addWorkspace).toBeDefined();
      expect(data.body.data.addWorkspace.id).toBeDefined();
      expect(data.body.data.addWorkspace.name).toEqual(name);
    });
});

test('Admin: Post Duplicate OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.addWorkspace).toBeDefined();
      expect(data.body.data.addWorkspace.id).toBeDefined();
      expect(data.body.data.addWorkspace.name).toEqual(name);
    });
});

test('Nobby: Post Denied', async () => {
  const nobby: string | undefined = await login.asNobby(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + nobby)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Member: Post OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.addWorkspace).toBeDefined();
      expect(data.body.data.addWorkspace.id).toBeDefined();
      expect(data.body.data.addWorkspace.name).toEqual(name);
    });
});
