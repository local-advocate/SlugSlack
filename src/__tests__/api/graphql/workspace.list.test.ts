import supertest from 'supertest';
import * as http from 'http';
import * as login from '../login';
import * as db from '../db';
import requestHandler from './requestHandler';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
let at1: string | undefined;

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

test('Get All (0) OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {workspace {
        owner {id name}
        accessTo {id name}
        invitedTo {id name}
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.workspace).toBeDefined();
      expect(data.body.data.workspace.owner.length).toEqual(0);
      expect(data.body.data.workspace.accessTo.length).toEqual(0);
      expect(data.body.data.workspace.invitedTo.length).toEqual(0);
    });
});

const name = 'WSTestSpace';
let id: string;

test('Post Workspace OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      id = data.body.data.addWorkspace.id;
    });
});

test('Get One OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `query {workspace {
        owner {id name}
        accessTo {id name}
        invitedTo {id name}
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.data).toBeDefined();
      expect(data.body.data.workspace).toBeDefined();
      expect(data.body.data.workspace.owner.length).toEqual(1);
      expect(data.body.data.workspace.owner[0].id).toEqual(id);
      expect(data.body.data.workspace.owner[0].name).toEqual(name);
      expect(data.body.data.workspace.accessTo.length).toEqual(0);
      expect(data.body.data.workspace.invitedTo.length).toEqual(0);
    });
});
