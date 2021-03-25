import React, { useState, useContext, useRef, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useMutation, useSubscription, useQuery } from "@apollo/client"
import { NEW_MESSAGE } from "../graphql/subscription"
import { SEND_MESSAGE } from "../graphql/mutation"
import { GET_MESSAGES } from "../graphql/query"
import Spinner from "../components/Spinner"

function Message({ selectedUser, refetch }) {
  const messageEl = useRef(null)
  const [value, setValue] = useState("")
  const { user } = useContext(AuthContext)
  const inputEl = useRef(null)

  const { data: messages, loading, subscribeToMore } = useQuery(GET_MESSAGES, {
    onError(err) {
      console.log(err)
    },
    variables: {
      userId: user.id,
      to: selectedUser,
    },
  })

  const {
    data: newMessage,
    loading: messageLoading,
    error: messageError,
  } = useSubscription(NEW_MESSAGE)

  const subscribeToNewMessage = () => {
    subscribeToMore({
      document: GET_MESSAGES,
      variables: { userId: user.id, to: selectedUser },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev
        const newMessageItem = subscriptionData.data.getMessages
        refetch()
        return Object.assign({}, prev, {
          getMessages: newMessageItem,
          ...prev.getMessages,
        })
      },
    })
  }

  useEffect(() => {
    if (messageError) return console.log(messageError)
    subscribeToNewMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage, messageLoading, messageError])

  // make scroll from bottom
  useEffect(() => {
    if (messageEl.current) {
      messageEl.current.scroll({
        top: messageEl.current.scrollHeight,
      })
    }
    // scroll when new message occur
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event
        target.scroll({ top: target.scrollHeight })
      })
    }

    if (inputEl) {
      inputEl.current.focus()
    }
  }, [messages, selectedUser])

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    variables: {
      from: user.id,
      to: selectedUser,
      body: value,
    },
    onError(err) {
      console.log(err)
    },
  })

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const sendMessageSubmit = (e) => {
    e.preventDefault()
    sendMessage()
    setValue("")
  }

  return (
    <>
      <div
        className="overflow-y-scroll flex-1 px-20 flex flex-col bg-gray-100"
        ref={messageEl}
      >
        {loading ? (
          <Spinner />
        ) : (
          messages &&
          messages.getMessages.map((message) => (
            <span
              key={message.id}
              className={
                message.from === user.id
                  ? "max-w-xs self-end py-2 px-3 rounded-md mb-2 bg-green-400"
                  : "max-w-xs bg-red-300 rounded-md py-2 px-3 mb-2"
              }
            >
              {message.body}
            </span>
          ))
        )}
      </div>

      <div>
        <form onSubmit={sendMessageSubmit}>
          <input
            ref={inputEl}
            type="text"
            className="input"
            placeholder="typing the message.."
            value={value}
            onChange={handleChange}
          />
        </form>
      </div>
    </>
  )
}

export default Message
