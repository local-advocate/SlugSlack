import {render, screen, waitFor, fireEvent, configure} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import ChannelList from '../../views/channel/list'
import { GlobalContext } from '../../views/context'

const handlers = [
  graphql.query('getAllCH', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        channel:[
          {id: 'ID1ID1ID1ID1', name: 'FirstCH', def:true},
          {id: 'Number2ID', name: 'Channel 2', def:false},
          {id: 'Third Num', name: 'Last Channel', def:false},
        ]
      })
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = (wid: string) => {
  render(
    <GlobalContext.Provider value={{
      wid:wid, setWid:(wid)=>(wid),
      cid: '', setCid:(cid)=>(cid),
      mid: '', setMid:(mid)=>(mid),
      wname: '', setWname:(wname)=>(wname),
      cname: '', setCname:(cname)=>(cname),
    }}>
      <ChannelList />
    </GlobalContext.Provider>
  )
};

test('Renders', async () => {
  renderView('WID');
});

test('Renders no context', async () => {
  render(<ChannelList />)
});

test('Text Present', async () => {
  renderView('WID')
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    expect(screen.getByText('* Channel 2')).toBeVisible();
    expect(screen.getByText('* Last Channel')).toBeVisible();
  })
});

test('Click text (Sets CID)', async () => {
  renderView('WID')
  expect(screen.getByText('Channels')).toBeVisible();
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
  })
  fireEvent.click(screen.getByText('# FirstCH'))
});

test('Click Revoke, components present', async () =>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('PersonRemoveIcon')[0])
    expect(screen.getByText('Remove User')).toBeVisible();
    expect(screen.getByText('Enter email of the user to be removed.')).toBeVisible();
    expect(screen.getByTestId('cancelCHRevoke')).toBeEnabled();
    expect(screen.getByTestId('revokeUSSend')).toBeEnabled();
  })
})

test('Cancel access revoke', async () =>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('PersonRemoveIcon')[0])
    expect(screen.getByText('Remove User')).toBeVisible();
    expect(screen.getByTestId('cancelCHRevoke')).toBeEnabled();
    fireEvent.click(screen.getByTestId('cancelCHRevoke'));
    expect(screen.getByText('Enter email of the user to be removed.')).not.toBeVisible();
  })
})

test('OK User Revoke', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('PersonRemoveIcon')[0])
    expect(screen.getByText('Remove User')).toBeVisible();
  })

  const tfield = screen.getByTestId('EmailRevoked2b')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByTestId('revokeUSSend'))
  expect(screen.getByText('Enter email of the user to be removed.')).not.toBeVisible();
})

test('OK User Revoke, No auth', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('PersonRemoveIcon')[0])
    expect(screen.getByText('Remove User')).toBeVisible();
  })
  const tfield = screen.getByTestId('EmailRevoked2b')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByTestId('revokeUSSend'))
  expect(screen.getByText('Enter email of the user to be removed.')).not.toBeVisible();
})

test('Click Add, components present', async () =>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('GroupAddIcon')[0])
    expect(screen.getByText('Add User')).toBeVisible();
    expect(screen.getByText('Enter email of the user to be added.')).toBeVisible();
    expect(screen.getByTestId('cancelCHAdd')).toBeEnabled();
    expect(screen.getByTestId('addUSSend')).toBeEnabled();
  })
})

test('Cancel access add', async () =>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('GroupAddIcon')[0])
    expect(screen.getByText('Add User')).toBeVisible();
    expect(screen.getByTestId('cancelCHAdd')).toBeEnabled();
    fireEvent.click(screen.getByTestId('cancelCHAdd'));
    expect(screen.getByText('Enter email of the user to be added.')).not.toBeVisible();
  })
})

test('OK User Add', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('GroupAddIcon')[0])
    expect(screen.getByText('Add User')).toBeVisible();
  })

  const tfield = screen.getByTestId('email2bAdded')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByTestId('addUSSend'))
  expect(screen.getByText('Enter email of the user to be added.')).not.toBeVisible();
})

test('OK User Add, No auth', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('GroupAddIcon')[0])
    expect(screen.getByText('Add User')).toBeVisible();
  })

  const tfield = screen.getByTestId('email2bAdded')
  fireEvent.click(tfield)
  await userEvent.type(tfield, 'user1111@gmail.com')
  fireEvent.click(screen.getByTestId('addUSSend'))
  expect(screen.getByText('Enter email of the user to be added.')).not.toBeVisible();
})

test('Delete Channel Click', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('DeleteIcon')[0])
  })
})

test('Delete Channel Click, No auth', async ()=>{
  renderView('WID')
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')

  await waitFor(() => {
    expect(screen.getByText('# FirstCH')).toBeVisible();
    fireEvent.click(screen.getAllByTestId('DeleteIcon')[0])
  })
})
