'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/models/models';
import { cognitoSignout, getCognitoSession } from '@/utils/cognito';



export const dynamic = 'force-dynamic';



interface AuthContextState {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
  getUserFromSession: (session: any) => User;
  checkingAuth: boolean;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const defaultUser: User = {email: '', expires: 0, isAdmin: false, idToken: ''};

const AuthContext = createContext<AuthContextState>({
    user: {...defaultUser},
    setUser: (user: User) => {},
    logout: () => {},
    getUserFromSession: (session: any) => ({...defaultUser}),
    checkingAuth: true
});



export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User>({...defaultUser});
  const [checkingAuth, setCheckingAuth] = useState(true);


  const logout = async () => {
    setUser({...defaultUser});
    await cognitoSignout();
  }

  const getCurrentDate = () => {
    let now: string | number = Date.now().toString();
    now = now.slice(0, -3);
    now = parseInt(now);
    return now;
  }

  function getDateFromSeconds(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const humanReadableDate = date.toLocaleString();
    return humanReadableDate;
  }

  const getUserFromSession = (session: any) => {
    const email = session.idToken?.payload?.email;
    const groups = session.idToken?.payload['cognito:groups'];
    const isAdmin = Array.isArray(groups) ? groups.includes('admin') : false; 
    const expires = session.idToken?.payload.exp;
    const idToken = session.idToken?.toString();
    return {email, isAdmin, expires, idToken};
  }

  const populateUser = async () => {
    setCheckingAuth(true);
    const session = await getCognitoSession();
    if (!session.idToken) { await logout(), setCheckingAuth(false) }
    else {
      const user = getUserFromSession(session);
      const now = getCurrentDate();
      if (user.expires < now) await logout()
      else setUser({...user});
      setCheckingAuth(false);
    }
  }


  useEffect(() => { populateUser(); }, []);

  useEffect(() => { console.log(user); console.log(`Token expires: ${getDateFromSeconds(user.expires)}`) }, [user]);


  return (
    <AuthContext.Provider value={{user, setUser, logout, getUserFromSession, checkingAuth}}>
        {children}
    </AuthContext.Provider>
  );
}



export const useAuth = () => useContext(AuthContext);


