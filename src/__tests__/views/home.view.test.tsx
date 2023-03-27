import {render, screen, fireEvent} from '@testing-library/react'
import {setupServer} from 'msw/node'
import Home from '../../views/home'
import 'whatwg-fetch'
import { GlobalContext } from '../../views/context'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = (wid: string) => {
  render(
    <GlobalContext.Provider value={{
      wid:wid, setWid:(wid)=>(wid),
      cid: '', setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: '', setWname:(wname)=>(wname),
      cname: '', setCname:(cname)=>(cname),
    }}>
      <Home />
    </GlobalContext.Provider>
  )
};

test('Renders', async () => {
  renderView('')
});

test('Render No Context, Nothing visible', async () => {
  renderView('WID')
  expect(screen.getByText('slack')).not.toBeVisible();
  expect(screen.getByText('Welcome Back')).not.toBeVisible();
  expect(screen.getByText('Logout')).not.toBeVisible();
  expect(screen.getByText('Welcome Back')).not.toBeVisible();
  expect(screen.getByText('Your Invitations')).not.toBeVisible();
});

test('Text Present', async () => {
  renderView('')
  expect(screen.getByText('slack')).toBeVisible();
  expect(screen.getByText('Welcome Back')).toBeVisible();
  expect(screen.getByText('Logout')).toBeEnabled();
  expect(screen.getByText('Welcome Back')).toBeVisible();
  expect(screen.getByText('Your Invitations')).toBeVisible();
});

test('Logout', async () => {
  renderView('')
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  fireEvent.click(screen.getByText('Logout'))
  expect(localStorage.getItem('user')).toBe(null)
});
