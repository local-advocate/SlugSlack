import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../pages/login'
import 'whatwg-fetch'

const handlers = [
  graphql.query('login', async (req, res, ctx) => {
    const json = await req.json()
    if (json.query.indexOf('user4444@gmail.com') >= 0) {
      return res(
        ctx.data({
          login: {
            "name": "User4",
            "accessToken": "whatever"
          }
        }),
      )
    } else {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      )
    }
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<Login />)
};

test('All components present', async () => {
  renderView()
  expect(screen.getByText('Email Address')).not.toBeNull();
  expect(screen.getByText('Password')).not.toBeNull();
  expect(screen.getByText('Sign In')).toBeEnabled();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(localStorage.getItem('user')).toBe(null);
});

test('Login Success', async () => {
  renderView()
  const email = screen.getByText('Email Address')
  await userEvent.type(email, 'user4444@gmail.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'Test User 4444')
  fireEvent.click(screen.getByText('Sign In'))
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null)
  });
});

test('Login Fail', async () => {
  renderView()
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  fireEvent.click(screen.getByText('Sign In'))
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
  expect(localStorage.getItem('user')).toBe(null)
});

test('Login Cancel', async () => {
  renderView()
  fireEvent.click(screen.getByText('Cancel'));
  expect(localStorage.getItem('user')).toBe(null);
});
