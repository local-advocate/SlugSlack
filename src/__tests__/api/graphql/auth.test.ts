import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  request = supertest(server);
  await db.reset();
  return new Promise(resolve => setTimeout(resolve, 500));
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const bad = {
  email: 'user1111@gmail.com',
  password: 'badpwdddd',
};

test('OK', async () => {
  const member = login.test1;
  await request.post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
    "${member.password}") { name, accessToken }}`})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.login.name).toEqual('Test User 1');
      expect(res.body.data.login.accessToken).toBeDefined();
    });
});

test('Invalid Credentials', async () => {
  await request.post('/api/graphql')
    .send(`{login(email: "${bad.email}" password: 
    "${bad.password}") { name, accessToken }}`)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Does not exist', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "dnedne@gmail.com" password: 
    "somePassword") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Invalid Format Password', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "email@gmail.com" password: 
        "pwd") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Invalid Format Email', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "emagmail.com" password: 
        "passworkOKOK") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

const ghost = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

test('Corrupt JWT', async () => {
  const accessToken = await login.asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken + 'garbage')
    .send({query: `query {channel(wid: "${ghost}") {id name def}}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      console.log(data.body)
      expect(data.body.errors.length).toEqual(1);
    });
});

test('No roles', async () => {
  const accessToken = await login.asNobby(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: 'query {channel(wid: "${wid}") {id name def}}'})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});


test('No auth header', async () => {
  await request.post('/api/graphql')
    .send({query: 'query {channel(wid: "${wid}") {id name def}}'})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
