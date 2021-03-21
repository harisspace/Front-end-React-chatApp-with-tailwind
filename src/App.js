import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import AuthRoute from "./utils/AuthRoute"
import Nav from "./components/Nav"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotMatch from "./pages/NotMatch"
import AuthContextProvider from "./contexts/AuthContext"
import ProtectRoute from "./utils/ProtectRoute"
import SelectedUserContextProvider from "./contexts/SelectedUserContext"

function App() {
  return (
    <AuthContextProvider>
      <SelectedUserContextProvider>
        <div>
          <Router>
            <Nav />
            <Switch>
              <ProtectRoute exact path="/" component={Home} />
              <AuthRoute path="/login" component={Login} />
              <AuthRoute path="/register" component={Register} />
              <Route path="*" component={NotMatch} />
            </Switch>
          </Router>
        </div>
      </SelectedUserContextProvider>
    </AuthContextProvider>
  )
}

export default App
