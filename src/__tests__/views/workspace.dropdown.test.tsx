import {render, screen, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Dropdown from '../../views/workspace/dropdown'
import 'whatwg-fetch'
import { GlobalContext } from '../../views/context'

const handlers = [
  graphql.mutation('inviteUser', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({}))
  }),
  graphql.mutation('revoke', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({}))
  }),
  graphql.mutation('deleteWorkspace', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({}))
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const wname = 'RandomWName';

const renderView = () => {
  render(
    <GlobalContext.Provider value={{
      wid:'RandomWid', setWid:(wid)=>(wid),
      cid: '', setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: wname, setWname:(wname)=>(wname),
      cname: '', setCname:(cname)=>(cname),
    }}>
      <Dropdown />
    </GlobalContext.Provider>
  )
};

const renderNoContext = () => {
  render(<Dropdown />)
};

test('Renders', async () => {
  renderView()
});

test('Renders No Context', async () => {
  renderNoContext()
});

test('Dropdown Menu Click, Components Present', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  expect(screen.getByText('Invite User')).toBeVisible();
  expect(screen.getByText('Revoke Access')).toBeVisible();
  expect(screen.getByText('Switch Workspace')).toBeVisible();
  expect(screen.getByText('Delete Workspace')).toBeVisible();
});

test('Invite User Click, Components Present', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Invite User'))
  expect(screen.getByText('Enter email of the user to be invited.')).toBeVisible();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(screen.getByText('Invite')).toBeEnabled();
});

test('Cancel User Invite', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Invite User'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(screen.getByText('Cancel')).not.toBeVisible();
});

test('OK User invite', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Invite User'))
  const tfield = screen.getByTestId('USNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByText('Invite'))
  expect(screen.getByText('Invite')).not.toBeVisible();
});

test('User invite, No Auth', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Invite User'))
  const tfield = screen.getByTestId('USNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByText('Invite'))
  expect(screen.getByText('Invite')).not.toBeVisible();
});

test('Revoke User Click, Components Present', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Revoke Access'))
  expect(screen.getByText('Enter email of the user to revoke their access.')).toBeVisible();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(screen.getByText('Revoke')).toBeEnabled();
});

test('Cancel User Revoke', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Revoke Access'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(screen.getByText('Cancel')).not.toBeVisible();
});

test('OK User Revoke', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Revoke Access'))
  const tfield = screen.getByTestId('USNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByText('Revoke'))
  expect(screen.getByText('Revoke')).not.toBeVisible();
});

test('User revoke, No Auth', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')
  
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Revoke Access'))
  const tfield = screen.getByTestId('USNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByText('Revoke'))
  expect(screen.getByText('Revoke')).not.toBeVisible();
});

test('Switch Workspaces', async () => {
  renderView()
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Switch Workspace'))
  expect(screen.getByText('Switch Workspace')).not.toBeVisible();
});

test('Delete Workspace', async () => {
  renderView()
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Delete Workspace'))
  expect(screen.getByText('Delete Workspace')).not.toBeVisible();
});

test('Delete Workspace, No auth', async () => {
  renderView()
  localStorage.removeItem('user')
  fireEvent.click(screen.getByText(wname))
  fireEvent.click(screen.getByText('Delete Workspace'))
  expect(screen.getByText('Delete Workspace')).not.toBeVisible();
});