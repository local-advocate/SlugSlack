import {render, screen, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import CreateWorkspace from '../../views/workspace/create'
import 'whatwg-fetch'

const handlers = [
  graphql.mutation('addWorkspace', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        addWorkspace:{
          id: 'CreateID',
          name: 'CreateName',
        }
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
  render(<CreateWorkspace />)
};

test('Renders', async () => {
  renderView()
});

test('Text & Button Present', async () => {
  renderView()
  expect(screen.getByText('Want to use Slack with a different team?')).toBeVisible();
  expect(screen.getByText('CREATE A NEW WORKSPACE')).toBeEnabled();
});

test('Click CreateWS, Components present', async () => {
  renderView()
  fireEvent.click(screen.getByText('CREATE A NEW WORKSPACE'))
  expect(screen.getByText('Create Workspace')).toBeVisible();
  expect(screen.getByText('Please enter the name of your new workspace.')).toBeVisible();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(screen.getByText('Create')).toBeEnabled();
});

test('Create Workspace No Auth', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  fireEvent.click(screen.getByText('CREATE A NEW WORKSPACE'))
  const tfield = screen.getByTestId('WSNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'WorkspaceTest')
  fireEvent.click(screen.getByText('Create'))
});

test('Create Workspace', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  fireEvent.click(screen.getByText('CREATE A NEW WORKSPACE'))
  const tfield = screen.getByTestId('WSNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'WorkspaceTest')
  fireEvent.click(screen.getByText('Create'))
});

test('Cancel Create Workspace', async () => {
  renderView()
  fireEvent.click(screen.getByText('CREATE A NEW WORKSPACE'))
  await fireEvent.click(screen.getByText('Cancel'))
});
