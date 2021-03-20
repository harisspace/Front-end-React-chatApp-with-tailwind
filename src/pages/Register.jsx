import React, { useState, useContext } from 'react'
import { useMutation, gql } from '@apollo/client'

import { useForm } from '../utils/useForm'
import { AuthContext } from '../contexts/AuthContext'

import Spinner from '../components/Spinner'

function Register(props) {
   const [errors, setErrors] = useState({})
   const { user, loginOrRegister } = useContext(AuthContext)
   const { values, handleChange, handleSubmit } = useForm(registerUserCallback, {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
   })

   const [registerUser, { loading }] = useMutation(REGISTER_USER, {
      variables: values,
      update(_, result) {
         loginOrRegister(result.data.register)
         props.history.push('/')
      },
      onError(err) {
         if (typeof err.graphQLErrors[0].extensions === 'object' && err.graphQLErrors[0].extensions !== null) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
         }else {
            console.error(err)
         }
      }
   })

   function registerUserCallback() {
      registerUser()
   }

   if (loading) {
      return <Spinner />
   }

   console.log(errors)
   

   return (
      <div className="max-w-lg m-auto mt-10 bg-gray-100 p-5">
         <h1 className="text-3xl uppercase text-center">login</h1>
         <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col">
               <label htmlFor="email">Username</label>
               <input onChange={handleChange} name="username" value={values.username} className={errors.username ? 'input-error':'input'} placeholder="username.." type="text" id="username" />
            </div>
            <div className="flex flex-col">
               <label htmlFor="email">Email</label>
               <input onChange={handleChange} value={values.email} className={errors.email ? 'input-error':'input'} placeholder="email.." type="text" name="email" id="email" />
            </div>
            <div className="flex flex-col mt-2">
               <label htmlFor="password">Password</label>
               <input onChange={handleChange} value={values.password} className={errors.password ? 'input-error':'input'} placeholder="password" type="password" id="password" name="password" />
            </div>
            <div className="flex flex-col mt-2">
               <label htmlFor="confirmPassword">Confirm Password</label>
               <input onChange={handleChange} value={values.confirmPassword} className={errors.confirmPassword ? 'input-error':'input'} placeholder="confirm password" type="password" id="confirmPassword" name="confirmPassword" />
            </div>
            <button class="btn mt-5" type="submit">Register</button>
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

export default Register

const REGISTER_USER = gql`
    mutation Register(
        $username: String!,
        $email: String!,
        $password: String!,
        $confirmPassword: String!
    ) {
        register(registerInput: {
            username: $username, email: $email, password: $password, confirmPassword: $confirmPassword
        }) {
            id
            email
            username
            createdAt
            token
        }
    }
`
