import {render, screen, waitFor} from '@testing-library/react'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import MessageList from '../../views/message/list'
import { GlobalContext } from '../../views/context'

const handlers = [
  graphql.query('getAllMS', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        message:
          [
            {id: 'M1', from:'User 1', time: '10AM', message:'First Message'},
            {id: 'M2', from:'User 2', time: '12PM', message:'Message2'},
            {id: 'M3', from:'User 3', time: '1AM', message:'Last Msg'},
          ]
      })
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(
    <GlobalContext.Provider value={{
      wid:'wid', setWid:(wid)=>(wid),
      cid: 'cid', setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: '', setWname:(wname)=>(wname),
      cname: 'cname', setCname:(cname)=>(cname),
    }}>
      <MessageList />
    </GlobalContext.Provider>
  )

};

test('Renders', async () => {
  renderView()
});

test('Renders No Context', async () => {
  render(<MessageList />)
});

test('Messages Present', async () => {
  renderView()
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  await waitFor(() => {
    expect(screen.getByText('First Message')).toBeVisible();
    expect(screen.getByText('Message2')).toBeVisible();
    expect(screen.getByText('Last Msg')).toBeVisible();
  })
});

test('Dates Present', async () => {
  renderView()
  await waitFor(() => {
    expect(screen.getByText('10AM')).toBeVisible();
    expect(screen.getByText('12PM')).toBeVisible();
    expect(screen.getByText('1AM')).toBeVisible();
  })
});

test('From (Users) Present', async () => {
  renderView()
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeVisible();
    expect(screen.getByText('User 2')).toBeVisible();
    expect(screen.getByText('User 3')).toBeVisible();
  })
});

test('Get All, No Auth', async () => {
  renderView()
  localStorage.removeItem('user')
  await waitFor(() => {
    expect(screen.getByText('10AM')).toBeVisible();
  })
});
