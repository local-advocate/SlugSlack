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

const defCH = 'Default CH';
const nondefCH = 'Non Default CH';

test('Create Channel Default', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"${defCH}",def:true}) {id, name, def}}`})
    .expect(200)
});

test('Create Channel Non-Default', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addChannel(wid: "${wid}", input:{name:"${nondefCH}",def:false}) {id, name, def}}`})
    .expect(200)
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

test('Get All CH, Check default', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `query {channel(wid: "${wid}") {id name def}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.channel.length).toEqual(1);
      expect(data.body.data.channel[0].name).toEqual(defCH);
      expect(data.body.data.channel[0].def).toBeTruthy();
    });
});

test('Get All, Check access', async () => {
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
      expect(data.body.data.workspace.accessTo.length).toEqual(1);
      expect(data.body.data.workspace.accessTo[0].id).toEqual(wid);
      expect(data.body.data.workspace.accessTo[0].name).toEqual(name);
    });
});

test('Accept Invitation Again, 404', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {invitationUpdate(wid:"${wid}", accept: true)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Create Again', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {addWorkspace(name: "${name}") {id}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      wid = data.body.data.addWorkspace.id;
    });
});

test('Invite Again', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at1)
    .send({query: `mutation {inviteUser(uid: "${uid}", wid: "${wid}")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.inviteUser).toBeDefined();
    });
});

test('Decline Invitation OK', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {invitationUpdate(wid:"${wid}", accept: false)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.invitationUpdate).toBeDefined();
    });
});

test('Get All, Check access', async () => {
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
      expect(data.body.data.workspace.accessTo.length).toEqual(1);
    });
});

test('Decline Again, 404', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + at4)
    .send({query: `mutation {invitationUpdate(wid:"${wid}", accept: false)}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
