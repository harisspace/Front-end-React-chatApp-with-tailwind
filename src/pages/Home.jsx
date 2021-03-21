import React, { useContext, useEffect, useRef } from "react"
import { gql, useLazyQuery, useQuery } from "@apollo/client"

import { AuthContext } from "../contexts/AuthContext"
import { SelectedUserContext } from "../contexts/SelectedUserContext"
import Spinner from "../components/Spinner"
import Contact from "../components/Contact"
import Message from "../components/Message"

function Home() {
  const mainRef = useRef(null)
  const { user } = useContext(AuthContext)
  const { selectedUser, selectUser } = useContext(SelectedUserContext)

  const { data, loading } = useQuery(GET_USERS_MESSAGE, {
    variables: { userId: user.id },
    onError(err) {
      console.error(err)
    },
  })

  // handle if never send message or find user
  const [getUsers, { loading: loadingUsers, data: usersData }] = useLazyQuery(
    GET_USERS,
    {
      onError(err) {
        console.log(err)
      },
    }
  )

  // console.log(data)

  // console.log(usersData)

  useEffect(() => {
    if (data !== undefined && data.getUsersMessage.length <= 0) {
      getUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const [
    getMessage,
    { loading: messageLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES, {
    onError(err) {
      console.log(err)
    },
  })

  useEffect(() => {
    if (selectedUser) {
      getMessage({
        variables: {
          userId: user.id,
          to: selectedUser,
        },
      })
    }
    // for scroll
    // if (mainRef.current) {
    //   mainRef.current.scroll({ top: mainRef.current.scrollHeight })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser])

  if (loading) {
    return <Spinner />
  }

  return (
    // devided 2 section
    <main className="grid grid-cols-4" ref={mainRef}>
      {/* card container */}
      <div className="col-span-1 max-h-screen overflow-y-scroll">
        {/* card contact */}
        {data &&
          data.getUsersMessage.map((user) => (
            <div key={user.id} onClick={() => selectUser(user.id)}>
              <Contact user={user} />
            </div>
          ))}

        {usersData !== undefined &&
          usersData.getUsers.map((user) => (
            <div key={user.id} onClick={() => selectUser(user.id)}>
              <Contact user={user} />
            </div>
          ))}
      </div>

      <div className="col-span-3 flex flex-col max-h-screen justify-between overflow-hidden">
        {messageLoading && <Spinner />}
        {messagesData && messagesData.getMessages && (
          <Message messages={messagesData.getMessages} />
        )}
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

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      username
      id
      email
      latestMessage {
        body
      }
      createdAt
    }
  }
`

export default Home
