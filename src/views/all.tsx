import Home from '../views/home'
import Header from '../views/header'
import Workspace from '../views/workspace/workspace'
import { GlobalContext } from './context';
import { useState } from 'react';

// WAS CREATED SO WE CAN TEST HOME WITH DIFF CONTEXT VALUES
export default function All() {

  // context
  const [wid, setWid] = useState<string>('')
  const [cid, setCid] = useState<string>('')
  const [mid, setMid] = useState<string>('')
  const [wname, setWname] = useState<string>('')
  const [cname, setCname] = useState<string>('')

  return (
    <GlobalContext.Provider value={{
      wid: wid, setWid: setWid,
      cid: cid, setCid: setCid,
      mid: mid, setMid: setMid,
      wname: wname, setWname: setWname,
      cname: cname, setCname: setCname}}>
      <Header />
      <Home />
      <Workspace />
    </GlobalContext.Provider>
  )
}