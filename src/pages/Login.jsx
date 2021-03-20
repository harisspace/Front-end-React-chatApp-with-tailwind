import React, { useState, useContext } from 'react'
import { gql, useMutation } from '@apollo/client'

import { useForm } from '../utils/useForm'
import { AuthContext } from '../contexts/AuthContext'

import Spinner from '../components/Spinner'

function Login(props) {
   const [errors, setErrors] = useState({})
   const { user, loginOrRegister } = useContext(AuthContext)
   const { values, handleChange, handleSubmit } = useForm(loginUserCallback, {
      username: '',
      password: ''
   })

   const [loginUser, { loading }] = useMutation(LOGIN_USER, {
      variables: values,
      update(_, result) {
         console.log(result.data.login)
         loginOrRegister(result.data.login)
         // props.history.push('/')
      },
      onError(err) {
         if (typeof err.graphQLErrors[0].extensions === 'object' && err.graphQLErrors[0].extensions !== null) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
         }
      }
   })

   function loginUserCallback() {
      loginUser()
   }

   if (loading) {
      return <Spinner />
   }

   return (
      <div className="max-w-lg m-auto mt-10 bg-gray-100 p-5">
         <h1 className="text-3xl uppercase text-center">login</h1>
         <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col">
               <label htmlFor="username">Username</label>
               <input className={errors.username ? 'input-error':'input'} placeholder="username.." type="text" name="username" id="username" value={values.username} onChange={handleChange} />
            </div>
            <div className="flex flex-col mt-2">
               <label htmlFor="password">Password</label>
               <input className={errors.password ? 'input-error':'input'} placeholder="password" type="password" id="password" name="password" value={values.password} onChange={handleChange} />
            </div>
            <button className="btn mt-5">Login</button>
         </form>
         {
            Object.keys(errors).length > 0 && (
               <ul class="list-disc list-inside bg-red-100 p-1 mt-2">
                  {
                     Object.values(errors).map(value => (
                        <li key={value}>
                           {value}
                        </li>
                     ))
                  }
               </ul>
            )
         }
      </div>
   )
}

const LOGIN_USER = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            username
            email
            createdAt
            token
        }
    }
`

export default Login
