import { createContext, useState } from 'react'
import * as jwt from 'jsonwebtoken'
require('dotenv/config')

let initialUser = {
    id: null,
    firstname: null,
    lastname: null,
    username: null
}

if(localStorage.getItem('jwt')) {
    let decodedToken = jwt.verify(localStorage.getItem('jwt'), process.env.REACT_APP_JWT_KEY)
    initialUser = {
        id: decodedToken.id,
        firstname: decodedToken.firstname,
        lastname: decodedToken.lastname,
        username: decodedToken.username
    }
}

export const UserContext = createContext();

export const UserProvider = ({children}) => {

    const [user, setUser] = useState(initialUser)

    const loginData = (token) => {
        localStorage.setItem('jwt', token)
        let decodedToken = jwt.verify(localStorage.getItem('jwt'), process.env.REACT_APP_JWT_KEY)
        setUser({
            id: decodedToken.id,
            firstname: decodedToken.firstname,
            lastname: decodedToken.lastname,
            username: decodedToken.username
        })

    }

    const logoutData = () => {
        localStorage.removeItem('jwt')
        setUser({
            id: null,
            firstname: null,
            lastname: null,
            username: null
        })
    }

    
    return ( 
        <UserContext.Provider value={{user, loginData, logoutData}}>
            {children}
        </UserContext.Provider>
    )
}