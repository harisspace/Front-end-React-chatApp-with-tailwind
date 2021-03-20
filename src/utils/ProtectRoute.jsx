import React, { useContext } from "react"
import { Route, Redirect } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"

function ProtectRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext)
  //   console.log(rest)
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        user ? <Component {...routeProps} /> : <Redirect to="/login" />
      }
    />
  )
}

export default ProtectRoute
