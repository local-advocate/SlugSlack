import { Box, Typography, Button,
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions,
  TextField} from '@mui/material';
import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useContext } from 'react';
import { GlobalContext } from '../context';

export default function CreateWorkspace() {
  // context
  const ctx = useContext(GlobalContext);

  // make workspace dialouge
  const [open, setOpen] = useState(false);
  const [wsname, setWsname] = useState('');
  const handleClickOpen = () => {setOpen(true)};
  const handleClose = () => {setOpen(false)};

  // create workspace query
  const createWS = () => {
    const postData = async () => {
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
        mutation addWorkspace($name: String!) {
          addWorkspace(name: $name) {
            id name
          }
        }
      `
      const variables = {name: wsname}
      const data = await graphQLClient.request(query, variables);
      ctx?.setWid(data.addWorkspace.id);
      ctx?.setWname(data.addWorkspace.name)
      setOpen(false)
    }
    postData()
      .catch(console.error);
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

  // create workspace dialog
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const wsDialogue = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{color:'#611f69'}}>Create Workspace</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Please enter the name of your new workspace.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="WSNme"
          label="Workspace"
          fullWidth
          variant="standard"
          onChange={(e) => setWsname(e.target.value.toString())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}
          id='cancelWSCreate'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={createWS} id='createWSCreate'
          sx = {buttonStyle}>Create</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        width:'75%',
        background: 'white',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: '5px',
        boxShadow: '1px 1px 10px #f6b0ff',
        mb: 2
      }}>
        <Typography variant='h6' sx={{
          color: '#611f69', m: 1, fontWeight: 'bold'}}> 
            Want to use Slack with a different team? 
        </Typography>
        <Button color="inherit" 
          onClick={handleClickOpen}
          sx = {{
            background: 'white',
            color: '#611f69',
            m: 1,
            border: 'solid',
            borderWidth: '1px',
            '&:hover': {
              background: '#dfd5e0'
            }
          }}
        >
            CREATE A NEW WORKSPACE
        </Button>
        {wsDialogue}
      </Box>
    </>
  )
}