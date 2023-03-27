import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';
import { UserInput } from '../../../graphql/user/schema';

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
  server.close(done);
  db.shutdown();
});

const post: UserInput = {
  email: "posteduser@gmail.com",
  password: "postedUser",
  name: "PostedUser"
};

test('Post OK', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation {signup(input:{
        email: "${post.email}",
        password: "${post.password}",
        name: "${post.name}"}) {id, email, name, roles}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.signup).toBeDefined();
      expect(data.body.data.signup.id).toBeDefined();
      expect(data.body.data.signup.name).toEqual(post.name);
      expect(data.body.data.signup.email).toEqual(post.email);
    });
});

test('Login as new user', async () => {
  const accessToken = login.login(request, {email: post.email, password: post.password});
  expect(accessToken).toBeDefined();
});

test('Post Duplicate', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation {signup(input:{
          email: "${post.email}",
          password: "${post.password}",
          name: "${post.name}"}) {id, email, name, roles}}`})
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
