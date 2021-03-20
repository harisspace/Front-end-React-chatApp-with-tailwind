import { createContext, useReducer } from 'react'
import jwt from 'jsonwebtoken'

import { authReducer } from '../reducers/authReducer'
import { SECRET_KEY } from '../Config'

export const AuthContext = createContext({
   user: null,
   loginOrRegister: (userData) => {},
   logout: () => {}
})

const initialState = {
   user: null
}

if (localStorage.getItem('jwtToken')) {
   const token = localStorage.getItem('jwtToken')
   const decodedToken = jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
       if (err) {
           if (err.message === 'jwt expired') {
               localStorage.removeItem('jwtToken')
               throw new Error('Sorry the token expired')
           }
           console.error(err)
       }
       return decodedToken
   })

   initialState.user = decodedToken
}

export default function AuthContextProvider(props) {
   const [state, dispatchAuth] = useReducer(authReducer, initialState)

   const loginOrRegister = (userData) => {
       console.log('set')
       localStorage.setItem('jwtToken', userData.token)
       dispatchAuth({
           type: 'LOGINORREGISTER',
           payload: userData
       })
   }

   const logout = () => {
       localStorage.removeItem('jwtToken')
       dispatchAuth({
           type: 'LOGOUT'
       })
   }

   return (
       <AuthContext.Provider value={{ user: state.user, logout, loginOrRegister }}>
           { props.children }
       </AuthContext.Provider>
   )
}