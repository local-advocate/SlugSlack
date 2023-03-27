import Router from 'next/router';
import { Box, CssBaseline, Typography, Button} from '@mui/material';
import React from 'react';
import { useContext, useEffect } from 'react';
import CreateWorkspace from './workspace/create';
import ListWorkspace from './workspace/list';
import Image from 'next/image'
import { GlobalContext } from './context';

export default function Home() {
  const ctx = useContext(GlobalContext);
  const wid = ctx?.wid;

  useEffect(() => {
    ctx?.setWid('');
    ctx?.setCid('');
  }, []);

  // logout
  const logout = ()  => {
    localStorage.removeItem('user');
    Router.push({
      pathname: '/'
    })
  }

  return (
    <>
      <CssBaseline />
      {/* Main Box, Top Box (Access & Owner) */}
      <Box sx={{
        display: wid?'none':'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background:'#611f69',
        height: '100vh'
      }}>
        {/* slack and logout */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignSelf: 'flex-start',
          justifyContent: 'space-between',
          width:'100%'
        }}>
          <Typography variant='h4' sx={{color: 'white', m: 1, fontWeight: '500'}}> 
            {/* creds: https://commons.wikimedia.org/wiki/File:Slack_icon_2019.svg */}
            <Image alt='slack' src='https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
              id='slacklogo' height="25" width="25"/>
            slack 
          </Typography>
          {/* Logout button */}
          <Button color="inherit" 
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
        </Box>
        {/* Welcome Back */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width:'75%',
          mt: 5,
          mb: 5
        }}>
          {/* creds: slack itself */}
          {/* <Image src="https://a.slack-edge.com/6c404/marketing/img/homepage/bold-existing-users/waving-hand@2x.gif" alt="" height="56" width="52" /> */}
          <Typography variant='h4' sx={{
            color: 'white', m: 1, fontWeight: 'bold'}}> 
            Welcome Back 
          </Typography>
        </Box>
        {/* Create Workspace */}
        <CreateWorkspace />
        {/* List workspaces and invitations */}
        <ListWorkspace />
      </Box>
    </>
  )
}
