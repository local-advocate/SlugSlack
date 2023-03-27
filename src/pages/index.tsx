import { Typography, Box, Button, Paper, CssBaseline} from '@mui/material';
import type { GetServerSideProps } from 'next'
import Header from '../views/header';
import Link from 'next/link';
import Image from 'next/image'

type FeatureProps = {
  features: string[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const features = ['About Us', 'Pricing', 'Company', 'Diversity'];
  return {
    props: {
      features: features
    },
  }
}

export default function Index({ features }: FeatureProps) {
  return (
    <>
      <CssBaseline />
      <Header />
      {/* Main */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        background:'#611f69',
        height: '100%',
        width: '100%',
      }}>
        {/* Top ROW */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignSelf: 'flex-start',
          justifyContent: 'space-evenly',
          width:'100%'
        }}>
          {/* Slack icon */}
          <Typography variant='h4' sx={{color: 'white', m: 1, fontWeight: '500'}}> 
            {/* creds: https://commons.wikimedia.org/wiki/File:Slack_icon_2019.svg */}
            <Image src='https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
              id='slacklogo' height="25" alt='slackVideo' width="25"/>
            slack 
          </Typography>
          {/* Links */}
          {/* Signin button */}
          <Button color="inherit" 
            href='login'
            sx = {{
              background: 'white',
              color: '#611f69',
              m: 1,
              '&:hover': {
                background: '#dfd5e0'
              }
            }}
          >
            Sign In
          </Button>
          {/* Signup button */}
          <Link href='signup' style={{textDecoration: 'none'}}>
            <Button color="inherit" 
              sx = {{
                color: '#fff',
                borderColor: '#fff',
                borderStyle: 'solid',
                borderWidth: '1px',
                m: 1
              }}
            >
              Sign Up
            </Button>
          </Link>
          {/* Pricing */}
          <Link href='Pricing' style={{textDecoration: 'none'}}>
            <Button color="inherit" 
              sx = {{
                color: '#fff',
                borderColor: '#fff',
                borderStyle: 'solid',
                borderWidth: '1px',
                m: 1
              }}
            >
              Pricing
            </Button>
          </Link>
        </Box>
        {/* 2nd row */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          m:2
        }}>
          {/* Slack great */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            flexGrow: '100%',
            background:'#611f69',
            m:1
          }}>
            <Typography variant='h4' sx={{
              color: 'white', m: 1, fontWeight: 'bold'}}> 
                Great teamwork starts with a digital HQ
            </Typography>
          </Box>
          {/* Slack image */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            flexGrow: '100%',
            background:'#611f69',
            width: '80%',
            m:2
          }}>
            <video autoPlay loop muted controls>
              <source src='https://a.slack-edge.com/9689dea/marketing/img/homepage/e2e-prospects/animations/webm/hero-product-ui.webm' type='video/webm'></source>
            </video>
          </Box>
          
        </Box>
        {/* 3rd row */}
        <Typography variant='h6' sx={{
          m:2,
          color: 'white', fontWeight: 'light',
        }}>
        With all your people, tools and communication in one place, you can work faster and more flexibly than ever before.
        </Typography>
        <Typography variant='h6' sx={{
          mt:0, ml: 2, mr: 2,
          color: 'white', fontWeight: 'bold',
        }}>
        Slack is free to try for as long as you’d like!
        </Typography>
      </Box>
      {/* Trsuted By */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background:'#f4ede4',
        height: '100%',
        width: '100%',
        mb: 0
      }}>
        <Typography sx={{fontWeight:'550', fontFamily: 'monospace'}}>
          TRUSTED BY COMPANIES ALL OVER THE WORLD
        </Typography>
        {/* Companies */ }
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          m: 1
        }}>
          <Paper square sx={{m:1}}>
            <Image src='https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg'
              id='slacklogo' height="25" alt='slackVideo' width="25"/>
          </Paper>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        background:'#fff',
        height: '100%',
        width: '100%',
      }}>
        {features.map((feature) => (
          <Paper square key={feature} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            m: 1,
            minWidth: 200,
            minHeight: 80,
          }}>
            <Link href={feature} style={{color:'#611f69'}}>
              <Typography sx={{fontWeight:'550', fontFamily: 'monospace'}}>
                {feature}
              </Typography>
            </Link>
          </Paper>
        ))}
      </Box>
      
    </>
  )
}
