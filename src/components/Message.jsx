import React, { useState, useContext, useRef, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { SelectedUserContext } from "../contexts/SelectedUserContext"
import { gql, useMutation } from "@apollo/client"

function Message({ messages }) {
  const messageEl = useRef(null)
  const [value, setValue] = useState("")
  const { user } = useContext(AuthContext)
  const { selectedUser } = useContext(SelectedUserContext)
  // console.log(messages)
  // console.log(user)
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    variables: {
      from: user.id,
      to: selectedUser,
      body: value,
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_MESSAGES,
        variables: { userId: user.id, to: selectedUser },
      })
      let newData = [...data.getMessages]
      newData = [result.data.sendMessage, ...newData]
      proxy.writeQuery({
        query: GET_MESSAGES,
        variables: { userId: user.id, to: selectedUser },
        data: { getMessages: { newData } },
      })
      setValue("")
    },
    onError(err) {
      console.log(err)
    },
  })

  // make scroll from bottom
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event
        target.scroll({ top: target.scrollHeight })
      })
    }
  }, [messages])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const sendMessageSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  if (messageEl.current) {
    messageEl.current.scroll({
      top: messageEl.current.scrollHeight,
    })
  }

  return (
    <>
      <div className="overflow-y-scroll flex-1 px-20" ref={messageEl}>
        {messages &&
          messages.map((message) => (
            <span
              key={message.id}
              className={
                message.from === user.id
                  ? "block text-right mb-2"
                  : "block mb-2"
              }
            >
              {message.body}
            </span>
          ))}
      </div>
      <div>
        <form onSubmit={sendMessageSubmit}>
          <input
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

const SEND_MESSAGE = gql`
  mutation SendMessage($from: ID!, $to: ID!, $body: String!) {
    sendMessage(from: $from, to: $to, body: $body) {
      id
      from
      createdAt
      body
      to
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

export default Message
