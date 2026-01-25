import { ReactNode } from "react";

export interface LoginClient {
  idClient: string ;
  keyClient: string;
}

export interface ClientData {
  idClient: string ;
  nameClient: string;
  logoPath: string;
}

export interface LoginUser {
  idClient:  string;
  userClient: string;
  passClient: string;
}

export interface SyncTables{
  type:string;
  msg:string;
  items?:number;
}

export interface TypeMsg{
  type:string;
  msg:string;
}

export interface ChildrenProps {
  children: ReactNode;
}