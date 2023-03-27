import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import ListWorkspace from '../../views/workspace/list'
import 'whatwg-fetch'

const handlers = [
  graphql.query('getAllWS', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        workspace:{
          owner: [{id: 'ID1ID1ID1ID1', name: 'FirstWS'}, {id: 'SecondID', name: 'WS2'}],
          accessTo: [{id: 'AccessIDID', name: 'accessWS1'}, {id: 'FourthID', name: 'AccessLast'}],
          invitedTo: [{id: 'InviteID1', name: 'InvitedWS'}, {id: 'LastID', name: 'LastWS'}]
        }
      })
    )
  }),
  graphql.mutation('invitationUpdate', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({}))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<ListWorkspace />)
};

test('Renders', async () => {
  renderView()
});

test('Text Present', async () => {
  renderView()
  expect(screen.getByText('Workspaces for you')).toBeVisible();
  expect(screen.getByText('Your Invitations')).toBeVisible();
});

test('Workspaces present', async () => {
  renderView()
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  await waitFor(() => {
    expect(screen.getByText('FirstWS')).not.toBeNull();
    expect(screen.getByText('WS2')).not.toBeNull();
    expect(screen.getByText('accessWS1')).not.toBeNull();
    expect(screen.getByText('AccessLast')).not.toBeNull();
    expect(screen.getByText('InvitedWS')).not.toBeNull();
    expect(screen.getByText('LastWS')).not.toBeNull();
  });
});

test('Accept Invite', async () => {
  renderView()
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  await waitFor(() => {
    expect(screen.getByText('LastWS')).not.toBeNull();
    expect(screen.getByText('InvitedWS')).not.toBeNull();
  });
  fireEvent.click(screen.getAllByText('Accept')[0])
});

test('Reject Invite', async () => {
  renderView()
  localStorage.removeItem('user')
  await waitFor(() => {
    expect(screen.getByText('LastWS')).not.toBeNull();
    expect(screen.getByText('InvitedWS')).not.toBeNull();
  });
  fireEvent.click(screen.getAllByText('Reject')[0])
});

test('Launch Workspace', async () => {
  renderView()
  await waitFor(() => {
    expect(screen.getByText('WS2')).not.toBeNull();
    expect(screen.getByText('AccessLast')).not.toBeNull();
  });
  fireEvent.click(screen.getAllByText('Launch')[0])
});