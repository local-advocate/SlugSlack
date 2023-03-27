import { createContext } from "react";

export interface GlobalContextType {
  wid?: string;
  setWid: (wid: string) => void;
  cid?: string;
  setCid: (cid: string) => void;
  mid?: string;
  setMid: (mid: string) => void;
  wname?: string;
  setWname: (wname: string) => void;
  cname?: string;
  setCname: (cname: string) => void;
}

export const GlobalContext = createContext<GlobalContextType|null>(null);