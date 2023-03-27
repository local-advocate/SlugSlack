import {render, screen} from '@testing-library/react'
import {setupServer} from 'msw/node'
import All from '../../views/all'
import 'whatwg-fetch'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<All />)
};

test('Renders', async () => {
  renderView()
});

test('Home visible', async () => {
  renderView()
  expect(screen.getByText('slack')).toBeVisible();
  expect(screen.getByText('Welcome Back')).toBeVisible();
  expect(screen.getByText('Your Invitations')).toBeVisible();
});
