import {render, screen, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import CreateMessage from '../../views/message/create'
import 'whatwg-fetch'

const handlers = [
  graphql.mutation('addMessage', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        addMessage:{
          id: 'CreateID',
          message: 'Message',
          from: 'Test User',
          time: 'UTCString'
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
  render(<CreateMessage />)
};

test('Renders', async () => {
  renderView()
});

test('Text & Button Present', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  expect(screen.getByTestId('sendMessageBox')).toBeVisible();
  expect(screen.getByTestId('sendMessageIcon')).not.toBeNull();
});

test('Type message, Send', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  const box = screen.getByTestId('sendMessageBox')
  fireEvent.click(box)
  await userEvent.type(box, 'Message')
  fireEvent.click(screen.getByTestId('sendMessageIcon'))
});

test('Create Message, No Auth', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')
  const box = screen.getByTestId('sendMessageBox')
  fireEvent.click(box)
  await userEvent.type(box, 'Message')
  fireEvent.click(screen.getByTestId('sendMessageIcon'))
});
