import { Box, Button,
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions,
  TextField, Checkbox, FormGroup, FormControlLabel} from '@mui/material';
import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useContext } from 'react';
import { GlobalContext } from '../context';

export default function CreateChannel() {
  // context
  const ctx = useContext(GlobalContext);

  // make workspace dialouge
  const [open, setOpen] = useState(false);
  const [chname, setChname] = useState('');
  const [def, setDef] = useState(true);
  const handleClickOpen = () => {setOpen(true)};
  const handleClose = () => {setOpen(false)};
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDef(event.target.checked);
  };

  // create channel query
  const createCH = () => {
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
        mutation addChannel($wid: String!, $name: String!, $def: Boolean!) {
          addChannel(wid: $wid, input:{name: $name, def: $def}) {
            id name def
          }
        }
      `
      const variables = {wid: ctx?.wid, name: chname, def: def}
      const data = await graphQLClient.request(query, variables);
      if (data.addChannel !== undefined) {
        ctx?.setCid(data.addChannel.id);
        ctx?.setCname(data.addChannel.name);
      }
    }
    postData()
      .catch(console.error);
    setOpen(false)
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

  // create channel dialog
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const chDialogue = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{color:'#611f69'}}>Create Channel</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Please enter the name the new channel.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="CHNme"
          label="Channel"
          fullWidth
          variant="standard"
          onChange={(e) => setChname(e.target.value.toString())}
        />
        <FormGroup>
          <FormControlLabel label="Default?" control={
            <Checkbox
              color="secondary"
              checked={def}
              id="checkboxChk"
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }/>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}
          id='cancelCHCreate'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={createCH} id='createCHCreate'
          sx = {buttonStyle}>Create</Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
      }}>
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
            + Create Channel
        </Button>
        {chDialogue}
      </Box>
    </>
  )
}