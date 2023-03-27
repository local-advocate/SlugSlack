import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { GlobalContext } from '../context';
import { useContext, useState } from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Divider, MenuItem, Button,
  Typography, TextField
} from '@mui/material';


// https://codesandbox.io/s/5be3eg?file=/demo.tsx:1273-1609
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


// Dropdown and its uses
export default function Dropdown() {
  const ctx = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [email, setEmail] = useState('');
  const handleClickOpen = () => {setInviteOpen(true); handleClose()};
  const handleClickClose = () => {setInviteOpen(false); handleClose()};
  const handleRevokeOpen = () => {setRevokeOpen(true); handleClose()};
  const handleRevokeClose = () => {setRevokeOpen(false); handleClose()};

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // switch workspaces
  const switchWS = () => {
    ctx?.setWid('');
    handleClose();
  }

  // button style (SHOULDVE PUT IN GLOBAL CSS)
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
        mutation inviteUser($uid: String!, $wid: String!) {
          inviteUser(uid: $uid, wid: $wid)
        }
      `
      const variables = {uid: email, wid: ctx?.wid}
      setInviteOpen(false)
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
  }

  // invite user dialog
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const invite = (
    <Dialog open={inviteOpen} onClose={handleClickClose}>
      <DialogTitle sx={{color:'#611f69'}}>Invite User</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Enter email of the user to be invited.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="USNme"
          label="Email Invite"
          fullWidth
          variant="standard"
          onChange={(e) => setEmail(e.target.value.toString())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}
          id='cancelWSCreate'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={inviteSend} id='inviteUSSend'
          sx = {buttonStyle}>Invite</Button>
      </DialogActions>
    </Dialog>
  )

  // revoke access query
  const revokeUpdate = () => {
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
        mutation revoke($uid: String!, $wid: String!) {
          revoke(uid: $uid, wid: $wid)
        }
      `
      const variables = {uid: email, wid: ctx?.wid}
      setRevokeOpen(false)
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
  }

  // revoke user dialog (better design in future)
  // https://codesandbox.io/s/mrxwve?file=/demo.tsx:732-1464
  const revoke = (
    <Dialog open={revokeOpen} onClose={handleRevokeClose}>
      <DialogTitle sx={{color:'#611f69'}}>Revoke Access</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{color:'#611f69'}}>
            Enter email of the user to revoke their access.
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="USNme"
          label="User Email"
          fullWidth
          variant="standard"
          onChange={(e) => setEmail(e.target.value.toString())}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRevokeClose}
          id='cancelWSCreate'
          sx = {buttonStyle}>Cancel</Button>
        <Button onClick={revokeUpdate} id='revokeUpUp'
          sx = {buttonStyle}>Revoke</Button>
      </DialogActions>
    </Dialog>
  )

  // delete workspace query
  // ask for confirmation in future
  const deleteWS = () => {
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
        mutation deleteWorkspace($wid: String!) {
          deleteWorkspace(wid: $wid)
        }
      `
      const variables = {wid: ctx?.wid}
      setInviteOpen(false)
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
    ctx?.setWid('');
    handleClose();
  }

  return (
    <>
      <Button
        id="demo-customized-button"
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        disableElevation
        sx={{background:'none', display:'flex', 
          '&:hover': {background:'none', border: '1px solid'}}}
      >
        {ctx?.wname}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClickOpen} disableRipple>
          <AddIcon />
          Invite User
        </MenuItem>
        <MenuItem onClick={handleRevokeOpen} disableRipple>
          <PersonRemoveIcon />
          Revoke Access
        </MenuItem>
        <MenuItem onClick={switchWS} disableRipple>
          <ChangeHistoryIcon />
          Switch Workspace
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={deleteWS} disableRipple>
          <DeleteIcon style={{color: '#f2564b'}}/>
          <Typography sx={{color:'#f2564b'}}>Delete Workspace</Typography>
        </MenuItem>
      </StyledMenu>
      {invite}
      {revoke}
    </>
  );
}
