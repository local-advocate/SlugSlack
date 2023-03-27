import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useContext } from 'react';
import { GlobalContext } from '../context';
import {
  IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// https://codesandbox.io/s/gu5h8d?file=/demo.tsx
export default function CreateMessage() {
  const ctx = useContext(GlobalContext);

  const [message, setMessage] = useState('');

  const sendMessage = () => {
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
        mutation addMessage($cid: String!, $message: String!) {
          addMessage(cid: $cid, input:{message: $message}) {
            id
          }
        }
      `
      const variables = {cid: ctx?.cid, message: message}
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
    setMessage('');
  }

  return (
    <FormControl fullWidth sx={{ 
      mt: 1, ml:0, width: '80%', position: 'absolute', bottom: '0' }}>
      <InputLabel>Create a message</InputLabel>
      <OutlinedInput
        multiline minRows={5} maxRows={5} id='sendMessageBox'
        onChange={(e)=>{setMessage(e.target.value.toString())}}
        value={message}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              id='sendMessageIcon'
              onClick={sendMessage}
              edge="end"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}