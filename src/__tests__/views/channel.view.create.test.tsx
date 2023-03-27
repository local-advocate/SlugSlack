import {render, screen, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import { GlobalContext } from '../../views/context'
import CreateChannel from '../../views/channel/create'

const handlers = [
  graphql.mutation('addChannel', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        addChannel:{
          id: 'CreateID',
          name: 'CreateName',
          def: false
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
  render(
    <GlobalContext.Provider value={{
      wid:'', setWid:(wid)=>(wid),
      cid: '', setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: '', setWname:(wname)=>(wname),
      cname: '', setCname:(cname)=>(cname),
    }}>
      <CreateChannel />
    </GlobalContext.Provider>
  )
};

test('Renders', async () => {
  renderView()
});

test('Renders no context', async () => {
  render(<CreateChannel />)
});

test('Text & Button Present', async () => {
  renderView()
  expect(screen.getByText('+ Create Channel')).toBeVisible();
  expect(screen.getByText('+ Create Channel')).toBeEnabled();
});

test('Click CreateCH, Components present', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  fireEvent.click(screen.getByText('+ Create Channel'))
  expect(screen.getByText('Create Channel')).toBeVisible();
  expect(screen.getByText('Please enter the name the new channel.')).toBeVisible();
  expect(screen.getByText('Default?')).toBeVisible();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(screen.getByText('Create')).toBeEnabled();
  expect(screen.getByTestId('checkboxChk')).toBeEnabled();
});

test('Cancel Create Channel', async () => {
  renderView()
  fireEvent.click(screen.getByText('+ Create Channel'))
  expect(screen.getByText('Create Channel')).toBeVisible();
  await fireEvent.click(screen.getByText('Cancel'))
  expect(screen.getByText('Please enter the name the new channel.')).not.toBeVisible();
});

test('Toggle checkbox', async () => {
  renderView()
  fireEvent.click(screen.getByText('+ Create Channel'))
  expect(screen.getByText('Create Channel')).toBeVisible();
  fireEvent.click(screen.getByTestId('checkboxChk'))
  fireEvent.click(screen.getByTestId('checkboxChk'))
  expect(screen.getByText('Please enter the name the new channel.')).toBeVisible();
});

test('Create Channel OK', async () => {
  renderView()
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  fireEvent.click(screen.getByText('+ Create Channel'))
  expect(screen.getByText('Create Channel')).toBeVisible();
  const tfield = screen.getByTestId('CHNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'ChannelTest')
  fireEvent.click(screen.getByText('Create'))
  expect(screen.getByText('Please enter the name the new channel.')).not.toBeVisible();
});

test('Create Channel OK, No Auth', async () => {
  renderView()
  localStorage.removeItem('user')

  fireEvent.click(screen.getByText('+ Create Channel'))
  expect(screen.getByText('Create Channel')).toBeVisible();
  const tfield = screen.getByTestId('CHNme')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'ChannelTest')
  fireEvent.click(screen.getByText('Create'))
  expect(screen.getByText('Please enter the name the new channel.')).not.toBeVisible();
});