import {render} from '@testing-library/react'
import {setupServer} from 'msw/node'
import App from '../../pages/app'
import 'whatwg-fetch'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

// EVERYTHING ELSE TESTED IN OTHER TESTS
const renderView = () => {
  render(<App />)
};

test('Renders', async () => {
  renderView()
});

test('No localStorage', async () => {
  renderView()
  expect(localStorage.getItem('user')).toBeNull()
});
