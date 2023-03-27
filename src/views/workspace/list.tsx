import { Box, Typography, Button, Paper} from '@mui/material';
import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useEffect, useContext } from 'react';
import { Workspace } from '../../graphql/workspace/schema';
import { GlobalContext } from '../context';

type wsList = {
  access: Workspace[],
  invitedTo: Workspace[]
}

export default function ListWorkspace() {
  // context
  const ctx = useContext(GlobalContext);

  const [workspaces, setWorkspaces] = useState<wsList>({access:[], invitedTo: []});

  // grab the workspace invitations and accesses
  useEffect(() => {
    const fetchData = async () => {
      const item = localStorage.getItem('user')
      const user = JSON.parse(item)
      const bearerToken = user ? user.accessToken : ''
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
      // const graphQLClient = new GraphQLClient('/api/graphql', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      const query = gql`
        query getAllWS {
          workspace {
            owner {
              name
              id
            }
            accessTo {
              name
              id
            }
            invitedTo {
              name
              id
            }
          }
        }
      `
      const data = await graphQLClient.request(query)
      setWorkspaces({access: data.workspace.accessTo.concat(data.workspace.owner), invitedTo: data.workspace.invitedTo})
    }
    fetchData()
      .catch(console.error);
  },[]);

  // launch the workspace
  const launch = (id:string, wname: string)  => {
    ctx?.setWid(id)
    ctx?.setWname(wname)
  }

  // accept or reject invite
  const updateInvite = async (id: string, accept: boolean) => {
    const item = localStorage.getItem('user')
    const user = JSON.parse(item)
    const bearerToken = user ? user.accessToken : ''
    const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
    // const graphQLClient = new GraphQLClient('/api/graphql', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })
    const query = gql`
      mutation invitationUpdate($wid: String!, $accept: Boolean!) {
        invitationUpdate(wid: $wid, accept: $accept)
      }
    `
    const variables = {wid: id, accept: accept}
    await graphQLClient.request(query, variables);
  }
  
  // wrapper accept invite
  const accept = (id:string)  => {
    updateInvite(id, true).catch(console.error)
  }
  
  // wrapper reject invite
  const reject = (id:string)  => {
    updateInvite(id, false).catch(console.error)
  }

  // button style
  const buttonStyle = {
    background: 'white',
    color: '#611f69',
    m: 1,
    border: 'solid',
    borderWidth: '1px',
    '&:hover': {
      background: '#dfd5e0'
    }
  };

  // ws list box style
  const mainBox = {
    display: 'flex',
    flexWrap: 'wrap',
    background: 'white',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  return (
    <>
      {/* Owner and access to */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width:'75%',
        background: 'white',
        borderRadius: '5px',
        boxShadow: '1px 1px 10px #f6b0ff',
        mb: 2
      }}>
        <Paper sx={{background:'#ecdeec'}}>
          <Typography variant='h6' sx={{
            color: '#611f69', m: 1, fontWeight: 'medium'}}> 
              Workspaces for you
          </Typography>
        </Paper>
        {workspaces.access.map((workspace: Workspace) => (
          <Box key={workspace.id} id={workspace.id} sx={mainBox}>
            <Typography variant='h6' sx={{
              color: '#611f69', ml: 1}}> 
              {workspace.name}
            </Typography>
            <Button color="inherit" 
              onClick={() => {
                launch(workspace.id, workspace.name)
              }}
              sx = {buttonStyle}
            >
                Launch
            </Button>
          </Box>
        ))}
      </Box>
      {/* Invitations */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width:'75%',
        background: '#f4ede4',
        borderRadius: '5px',
        boxShadow: '1px 1px 10px #ffeacf',
        mb: 2
      }}>
        <Paper sx={{background:'#ffeacf'}}>
          <Typography variant='h6' sx={{
            color: '#611f69', m: 1, fontWeight: 'medium'}}> 
              Your Invitations
          </Typography>
        </Paper>
        {workspaces.invitedTo.map((workspace: Workspace) => (
          <Box key={workspace.id} id={workspace.id} sx={{
            display: 'flex',
            flexWrap: 'wrap',
            background: '#fff2e0',
            justifyContent: 'space-around',
            alignItems: 'center'}}>
            <Typography variant='h6' sx={{color: '#611f69', m: 1, fontWeight: 'medium'}}> 
              {workspace.name}
            </Typography>
            <Button color="inherit"
              onClick={() => {
                accept(workspace.id)
              }}
              sx = {buttonStyle}
            >
                Accept
            </Button>
            <Button color="inherit" 
              onClick={() => {
                reject(workspace.id)
              }}
              sx = {buttonStyle}
            >
                Reject
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
}
