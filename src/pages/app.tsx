import Router from 'next/router'
import { useEffect } from 'react';

import All from '../views/all'
import Header from '../views/header'

export default function App() {
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      Router.push({
        pathname: '/login'
      })
    }
  },[]);

  return (
    <>
      <Header />
      <All />
    </>
  )
}