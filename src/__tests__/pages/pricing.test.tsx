import {render, screen, fireEvent} from '@testing-library/react'
import {setupServer} from 'msw/node'
import Pricing from '../../pages/Pricing'
import 'whatwg-fetch'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<Pricing />)
};

test('Renders', async () => {
  renderView()
});

test('Components Visible', async () => {
  renderView()
  expect(await screen.findByText('Terms of use')).not.toBeNull();
  expect(await screen.findByText('API')).not.toBeNull();
  expect(await screen.findByText('Support')).not.toBeNull();
  expect(await screen.findByText('Free')).not.toBeNull();
  expect(await screen.findByText('Pro')).not.toBeNull();
});

test('Buttons & Links', async () => {
  renderView()
  expect(await screen.findByText('Sign In')).not.toBeNull();
  expect(await screen.findByText('signup')).not.toBeNull();
  expect(await screen.findByText('Get started')).not.toBeNull();
  expect(await screen.findByText('Contact Us')).not.toBeNull();
  expect(await screen.findByText('Values')).not.toBeNull();
});

test('Click buttons', async () => {
  renderView()
  expect(await screen.findByText('Sign In')).not.toBeNull();
  fireEvent.click(screen.getByText('Sign In'))
  expect(await screen.findByText('signup')).not.toBeNull();
  fireEvent.click(screen.getByText('signup'))
  expect(await screen.findByText('Get started')).not.toBeNull();
  fireEvent.click(screen.getByText('Get started'))
});