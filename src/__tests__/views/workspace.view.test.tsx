import {render, screen, configure, fireEvent} from '@testing-library/react'
import {setupServer} from 'msw/node'
import Workspace from '../../views/workspace/workspace'
import 'whatwg-fetch'
import { GlobalContext } from '../../views/context'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = (cid: string) => {
  render(
    <GlobalContext.Provider value={{
      wid:'wid', setWid:(wid)=>(wid),
      cid: cid, setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: '', setWname:(wname)=>(wname),
      cname: 'cname', setCname:(cname)=>(cname),
    }}>
      <Workspace />
    </ GlobalContext.Provider>
  ) 
};

// NO NEED TO TEST ADDITIONAL STUFF,
// INDIVIDUAL COMPS TESTED ALREADY
test('Renders', async () => {
  renderView('cid')
});

test('Renders no Context', async () => {
  render(<Workspace />)
});

test('Renders w/o channel selected', async () => {
  renderView('')
});

test('Logout', async () => {
  renderView('cid')
  configure({testIdAttribute: 'id'});
  fireEvent.click(screen.getByTestId('workspaceLogout'));
  expect(localStorage.getItem('user')).toBeNull();
});
