import { render, screen } from '@testing-library/react'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'
import Index from '../../pages/index';
import { getServerSideProps } from '../../pages/index';

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const server = setupServer()

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = async () => {
  const {props}  = await getServerSideProps(
    {req: { headers: { host: 'localhost:3000'}}})
  render(<Index features={props.features}/>)
};

test('Renders', async () => {
  renderView()
});

test('Text Present', async () => {
  renderView()
  expect(await screen.findByText('Great teamwork starts with a digital HQ')).not.toBeNull();
  expect(screen.findByText('Slack is free to try for as long as you’d like!')).not.toBeNull();
  expect(screen.findByText('With all your people, tools and communication in one place, you can work faster and more flexibly than ever before.')).not.toBeNull();
  expect(screen.findByText('TRUSTED BY COMPANIES ALL OVER THE WORLD')).not.toBeNull();
});

test('Buttons & Links Clickable', async () => {
  renderView()
  expect(await screen.findByText('Sign In')).toBeEnabled();
  expect(await screen.findByText('Sign Up')).not.toBeNull();
  expect(await screen.findByText('Company')).not.toBeNull();
  expect(await screen.findByText('About Us')).not.toBeNull();
  expect(await screen.findByText('Diversity')).not.toBeNull();
});