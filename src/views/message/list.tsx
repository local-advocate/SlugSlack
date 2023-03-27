import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useEffect, useContext } from 'react';
import { FullMessage } from '../../graphql/message/schema';
import { GlobalContext } from '../context';
import { Typography, Divider, ListItem,
  List, ListItemText} from '@mui/material';

// https://codesandbox.io/s/kmzq0p?file=/demo.tsx:821-971
export default function MessageList() {
  // context
  const ctx = useContext(GlobalContext);

  const [messages, setMessages] = useState<FullMessage[]>([]);

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
        query getAllMS($cid: String!) {
          message(cid: $cid) {id from time message}
        }
      `
      const variables = {cid: ctx?.cid}
      const data = await graphQLClient.request(query, variables);
      setMessages(data.message)
    }
    fetchData()
      .catch(console.error);
  },[ctx?.cid]);

  // https://codesandbox.io/s/ok7lbu?file=/demo.tsx
  return (
    <>
      <List sx={{ width: '100%', maxHeight:'80%', minHeight:'80%'}}>
        {messages.map((message: FullMessage) => (
          <ListItem alignItems="flex-start" key={message.id}>
            <ListItemText
              primary={
                <>
                  <b>{message.from}</b>
                  <i>&nbsp;&nbsp;{message.time}</i>
                </>
              }
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {message.message}
                  </Typography>
                  <Divider />
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}