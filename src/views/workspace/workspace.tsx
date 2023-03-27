import { Box, Toolbar, Button, AppBar, Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import Router from 'next/router';
import { GlobalContext } from '../context';
import Dropdown from './dropdown';
import ChannelList from '../channel/list';
import CreateChannel from '../channel/create';
import MessageList from '../message/list';
import CreateMessage from '../message/create';

export default function Workspace() {

  const ctx = useContext(GlobalContext);
  const wid = ctx?.wid;

  // logout
  const logout = ()  => {
    localStorage.removeItem('user');
    Router.push({
      pathname: '/'
    })
  }

  return (
    <>
      {/* AppBar: https://codesandbox.io/s/m8i34b?file=/demo.tsx */}
      <AppBar position="static" sx={{display: wid?'flex':'none', background:'#611f69',  justifyContent: 'center'}}>
        <Toolbar variant="dense" sx={{height:40}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SlugSlack
          </Typography>
          <Button color="inherit" id='workspaceLogout'
            onClick={() => {
              logout()
            }}
            sx = {{
              background: 'white',
              color: '#611f69',
              m: 1,
              '&:hover': {
                background: '#dfd5e0'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* main box, ws items and messages */}
      <Box sx={{display: wid?'flex':'none', flexDirection: 'row'}}>
        {/* workspace items box (name, channels, etc.) */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          background: '#611f69',
          width:'20%',
          height: '100vh'
        }}>
          <Divider sx={{borderColor:'#fff'}}/>
          {/* Dropdown menu */}
          <Dropdown />
          <Divider sx={{borderColor:'#fff'}}/>
          {/* Channel list */}
          <ChannelList />
          <Divider sx={{borderColor:'#fff'}}/>
          <CreateChannel />
          {/* Create Channel */}
          <Divider sx={{borderColor:'#fff'}}/>
        </Box>
        {/* message box (list and create) */}
        <Box sx={{
          display: ctx?.cid!==''?'flex':'none',
          flexDirection: 'column',
          minWidth:'80%',
          height: '70%',
          minHeight: '70vh',
          ml: 1
        }}>
          {/* Message List */}
          <MessageList />
          {/* Create Message */}
          <CreateMessage />
        </Box>
      </Box>
      
    </>
  )
}