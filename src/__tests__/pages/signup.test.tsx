import {render, screen, waitFor, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Signup from '../../pages/signup'
import 'whatwg-fetch'

const handlers = [
  graphql.operation(async (req, res, ctx) => {
    const json = await req.json()
    // everyone except user9999@gmail.com exists
    if (json.query.indexOf('user9999@gmail.com') >= 0) {
      return res(
        ctx.data({
          signup: {name: 'Name', email: 'email@email.com', roles: ['member'], id: 'id'}
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
  render(<Signup />)
};

test('All components present', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  expect(screen.getByTestId('email')).not.toBeNull();
  expect(screen.getByText('Password')).not.toBeNull();
  expect(screen.getByText('Full Name')).not.toBeNull();
  expect(screen.getByText('Sign Up')).toBeEnabled();
  expect(localStorage.getItem('user')).toBe(null);
});

test('Signup Success', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  const email = screen.getByTestId('email')
  await userEvent.type(email, 'user9999@gmail.com')
  const passwd = screen.getByTestId('password')
  await userEvent.type(passwd, 'Test User 9999')
  const name = screen.getByTestId('fullName')
  await userEvent.type(name, 'Test User 9')
  fireEvent.click(screen.getByText('Sign Up'))
  await waitFor(() => {
    expect(localStorage.getItem('user')).toBe(null)
  });
});

test('Already Exists Signup', async () => {
  renderView()
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  const email = screen.getByTestId('email')
  await userEvent.type(email, 'user1111@gmail.com')
  const passwd = screen.getByTestId('password')
  await userEvent.type(passwd, 'Test User 1111')
  const name = screen.getByTestId('fullName')
  await userEvent.type(name, 'Test User 1')
  fireEvent.click(screen.getByText('Sign Up'))
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
});
