import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

function Nav() {
   const { user, logout } = useContext(AuthContext)

   return (
      <nav className="flex justify-between p-2 bg-gray-200 border-1 border-gray-100">
         <div>
            <a href="/">
               <h1 className="text-2xl">Chat</h1>
            </a>
         </div>
         {
            user ? (
               <ul className="flex">
                  <li onClick={logout} className="mr-8 btn">
                     <a className="" href="/logout">Logout</a>
                  </li>
               </ul>
            ) : (
               <ul className="flex">
                  <li className="mr-8 btn">
                     <a className="" href="/login">Login</a>
                  </li>
                  <li className="btn">
                     <a href="/register">Register</a>
                  </li>
               </ul>
            )
         }
      </nav>
   )
}

export default Nav
