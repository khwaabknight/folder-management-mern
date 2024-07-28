import React from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';


// when the account is signed in
const PublicRoute = ({children}:{children:React.ReactNode}) => {
    const {user} = useSelector((state : RootState) => state.user);
    if(!user) return <>{children}</>
    else return <Navigate to={'/'} />
}

export default PublicRoute