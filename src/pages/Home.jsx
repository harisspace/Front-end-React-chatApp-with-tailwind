import React, { useContext, useEffet } from "react"
import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client"

import { AuthContext } from "../contexts/AuthContext"
import { SelectedUserContext } from "../contexts/SelectedUserContext"
import Spinner from "../components/Spinner"
import Contact from "../components/Contact"
import Messages from "../components/Messages"

function Home() {
  const { user } = useContext(AuthContext)
  const { selectedUser, selectUser } = useContext(SelectedUserContext)

  const { data, loading } = useQuery(GET_USERS_MESSAGE, {
    variables: { userId: user.id },
    onError(err) {
      console.error(err)
    },
  })

  if (loading) {
    return <Spinner />
  }

  return (
    // devided 2 section
    <main className="grid grid-cols-4">
      {/* card container */}
      <div className="col-span-1 max-h-screen overflow-y-scroll">
        {/* card contact */}
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
      </div>

      <div className="col-span-3 max-h-fluid overflow-hidden">
        <Messages />
      </div>
    </main>
  )
}

const GET_USERS_MESSAGE = gql`
  query GetUsersMessage($userId: ID!) {
    getUsersMessage(userId: $userId) {
      id
      username
      createdAt
      latestMessage {
        id
        from
        to
        createdAt
        body
      }
    }
  }
`

const GET_MESSAGES = gql`
  query GetMessages($userId: ID!, $to: ID!) {
    getMessages(userId: $userId, to: $to) {
      id
      from
      to
      createdAt
      body
    }
  }
`

export default Home
