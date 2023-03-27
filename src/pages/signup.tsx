// https://github.com/mui/material-ui/blob/v5.11.7/docs/data/material/getting-started/templates/sign-up/SignUp.tsx

import * as React from 'react';
import Router from 'next/router'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from '../views/header'
import Copyright from '../views/copyright';

const theme = createTheme();

export default function Signup() {

  const [user, setUser] = React.useState({fullName: '', email: '', password: ''});
  // const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleInputChange = (event: React.SyntheticEvent) => {
    const {value, name} = event.target as HTMLButtonElement;
    const u = user;
    u[name as keyof typeof user] = value;
    setUser(u);
    // setDisabled(user.fullName == '' || user.email == '' || user.password == '');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = {query: `mutation {signup(input:{
      email: "${user.email}",
      password: "${user.password}",
      name: "${user.fullName}"}) {id, email, name, roles}}`}
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
          alert('Error, please try again');
        } else {
          localStorage.setItem('user', JSON.stringify(json.data.login));
          Router.push({
            pathname: '/login'
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
              SlugSlack - Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="fullName"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright />
        </Container>
      </ThemeProvider>
    </>
  );
}