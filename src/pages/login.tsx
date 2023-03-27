// https://github.com/mui/material-ui/tree/v5.11.6/docs/data/material/getting-started/templates/sign-in

import Router from 'next/router'
import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import Header from '../views/header'
import Copyright from '../views/copyright';

const theme = createTheme();

export default function Login() {
  const [user, setUser] = React.useState({email: '', password: ''});
  // const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  // https://freshman.tech/snippets/typescript/fix-value-not-exist-eventtarget/
  const handleInputChange = (event: React.SyntheticEvent) => {
    const {value, name} = event.target as HTMLButtonElement;
    const u = user;
    // https://stackoverflow.com/a/69198602
    u[name as keyof typeof user] = value;
    setUser(u);
    // setDisabled(user.email == '' || user.password == '');
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const query = {query: `query login{login(email: "${user.email}" password: "${user.password}") { name, accessToken }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert('Error logging in, please try again');
        } else {
          localStorage.setItem('user', JSON.stringify(json.data.login));
          Router.push({
            pathname: '/app'
          })
        }
      })
  };

  return (
    <>
      <Header />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar src="https://news.ucsc.edu/2020/07/images/strongslugredwood4001.jpg"
              sx={{width: 96, height: 96}}
            />
            <Typography component="h1" variant="h5">
              SlugSlack
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
              <TextField
                onChange={handleInputChange}
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                type="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={handleInputChange}
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                type="password"
                label="Password"
                aria-label="Password"
                autoComplete="password"
              />
              <Button
                type="submit"
                fullWidth
                // disabled={disabled}
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
              Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{mt: 0, mb: 2}}
                onClick={() => {
                  Router.push({
                    pathname: '/'
                  })
                }}
              >
              Cancel
              </Button>
            </Box>
          </Box>
          <Copyright />
        </Container>
      </ThemeProvider>
    </>
  );
}
