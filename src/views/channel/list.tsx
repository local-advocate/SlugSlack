import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useEffect, useContext } from 'react';
import { Channel } from '../../graphql/channel/schema';
import { GlobalContext } from '../context';
import { Typography, Button, Grid, ListItem,
  List, IconButton, ListItemText, Dialog, DialogTitle,
  DialogActions, DialogContentText, DialogContent,
  TextField, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

// https://codesandbox.io/s/kmzq0p?file=/demo.tsx:821-971
export default function ChannelList() {
  // context
  const ctx = useContext(GlobalContext);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [access, setAccess] = useState(true);
  const handleClickClose = () => {setInviteOpen(false);};
  const handleClickOpen = () => {setInviteOpen(true); setAccess(true)};
  const handleRemoveClose = () => {setRemoveOpen(false); setAccess(true)};
  const handleRemoveOpen = () => {setRemoveOpen(true); setAccess(false)};
  const [email, setEmail] = useState('');

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
        query getAllCH($wid: String!) {
          channel(wid: $wid) {id name def}
        }
      `
      const variables = {wid: ctx?.wid}
      const data = await graphQLClient.request(query, variables);
      setChannels(data.channel)
    }
    fetchData()
      .catch(console.error);
  },[ctx?.wid]);

  // set cid
  const launch = (id: string, name: string) => {
    ctx?.setCid(id)
    ctx?.setCname(name)
  }

  // invite user query
  const inviteSend = () => {
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
        mutation accessCH($wid: String!, $cid: String!, $uid: String!, $access: Boolean!) {
          accessCH(wid: $wid, cid: $cid, uid: $uid, access: $access)
        }
      `
      const variables = {uid: email, wid: ctx?.wid, cid: ctx?.cid, access: access}
      setInviteOpen(false); setRemoveOpen(false);
      await graphQLClient.request(query, variables);
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
  
  // invite user dialog
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const invite = (
    <Dialog open={inviteOpen} onClose={handleClickClose}>
      <DialogTitle sx={{color:'#611f69'}}>Add User</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Enter email of the user to be added.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="email2bAdded"
          label="Email"
          fullWidth
          variant="standard"
          onChange={(e) => setEmail(e.target.value.toString())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}
          id='cancelCHAdd'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={inviteSend} id='addUSSend'
          sx = {buttonStyle}>Add</Button>
      </DialogActions>
    </Dialog>
  )

  // revoke user dialog
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const revoke = (
    <Dialog open={removeOpen} onClose={handleRemoveClose}>
      <DialogTitle sx={{color:'#611f69'}}>Remove User</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Enter email of the user to be removed.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="EmailRevoked2b"
          label="Email Invite"
          fullWidth
          variant="standard"
          onChange={(e) => setEmail(e.target.value.toString())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRemoveClose}
          id='cancelCHRevoke'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={inviteSend} id='revokeUSSend'
          sx = {buttonStyle}>Remove</Button>
      </DialogActions>
    </Dialog>
  )

  // delete channel query
  // ask for confirmation in future
  const deleteCH = () => {
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
        mutation deleteCH($wid: String!, $cid: String!) {
          deleteCH(wid: $wid, cid: $cid)
        }
      `
      const variables = {wid: ctx?.wid, cid: ctx?.cid}
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
    ctx?.setCid('');
  }

  return (
    <>
      <Grid item xs={12} md={6}>
        <Typography sx={{color: '#fff', ml: 2}} variant="subtitle" component="div">
            Channels
        </Typography>
        <List dense={true}>
          {channels.map((channel: Channel) => (
            <ListItem
              key={channel.id}
              onClick={()=>launch(channel.id, channel.name)}
              secondaryAction={
                <>
                  <IconButton edge="end" id="PersonRemoveIcon" aria-label="add" onClick={handleRemoveOpen}>
                    <PersonRemoveIcon style={{color:'#fff'}}/>
                  </IconButton>
                  <IconButton edge="end" id="GroupAddIcon" aria-label="add" onClick={handleClickOpen}>
                    <GroupAddIcon style={{color:'#fff'}}/>
                  </IconButton>
                  <IconButton edge="end" id="DeleteIcon" aria-label="delete" onClick={deleteCH}>
                    <DeleteIcon style={{color:'#f2564b'}}/>
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={channel.def?"# "+channel.name:"* "+channel.name} sx={{color:'#fff'}}/>
            </ListItem>
          ))}
        </List>
      </Grid>
      {invite}
      {revoke}
    </>
  );
}