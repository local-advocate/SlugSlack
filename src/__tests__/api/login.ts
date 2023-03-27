import supertest from 'supertest';
import {Credentials} from '../../graphql/auth/schema';

type req = supertest.SuperTest<supertest.Test>;

export const test1 = {
  email: 'user1111@gmail.com',
  password: 'Test User 1111',
};
  
export const test4 = {
  email: 'user4444@gmail.com',
  password: 'Test User 4444',
};

export const nobby = {
  email: 'nobby@gmail.com',
  password: 'Test User 6666',
};
  
export async function login(request: req, member: Credentials): Promise<string|undefined> {
  let accessToken;
  await request.post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
    "${member.password}") { name, accessToken }}`})
    .expect(200)
    .then((res) => {
      accessToken = res.body.data.login.accessToken;
    });
  return accessToken;
}
  
export async function asTest1(request: req): Promise<string|undefined> {
  return login(request, test1);
}
  
export async function asTest4(request: req): Promise<string|undefined> {
  return login(request, test4);
}
  
export async function asNobby(request: req): Promise<string|undefined> {
  return login(request, nobby);
}
  