import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'

function AuthRoute({ component: Component, ...rest }) {
   const { user } = useContext(AuthContext)

   return(
      <Route {...rest} render={routeProps => user ? <Redirect to='/' /> : <Component {...routeProps} />} />
   )
}

export default AuthRoute