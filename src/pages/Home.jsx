import React, { useContext, useEffect, useRef } from "react"
import { useLazyQuery, useQuery } from "@apollo/client"
import { AuthContext } from "../contexts/AuthContext"
import { SelectedUserContext } from "../contexts/SelectedUserContext"
import Spinner from "../components/Spinner"
import Contact from "../components/Contact"
import Message from "../components/Message"
import { MessageContext } from "../contexts/MessageContext"
import { GET_MESSAGES, GET_USERS_MESSAGE, GET_USERS } from "../graphql/query"

function Home() {
  const mainRef = useRef(null)
  const { user } = useContext(AuthContext)
  const { selectedUser, selectUser } = useContext(SelectedUserContext)
  const { newMessages } = useContext(MessageContext)

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
    if (selectedUser && messagesData) {
      newMessages(messagesData.getMessages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesData, messageLoading])

  // useEffect(() => {
  //   if (selectedUser) {
  //     getMessage({
  //       variables: {
  //         userId: user.id,
  //         to: selectedUser,
  //       },
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedUser])

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
        {/* {messageLoading && <Spinner />}
        {messagesData && messagesData.getMessages && (
          <Message messages={messagesData.getMessages} />
        )} */}
        {selectedUser ? <Message selectedUser={selectedUser} /> : <Spinner />}
      </div>
    </main>
  )
}

export default Home
