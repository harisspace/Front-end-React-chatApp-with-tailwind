import { useReducer, createContext } from "react"
import { messageReducer } from "../reducers/messageReducer"

export const MessageContext = createContext()

export const initialState = null

export default function MessageContextProvider(props) {
  const [messages, dispatch] = useReducer(messageReducer, initialState)

  const newMessage = (message) => {
    dispatch({
      type: "NEW_MESSAGE",
      payload: message,
    })
  }

  const newMessages = (messages) => {
    dispatch({
      type: "NEW_MESSAGES",
      payload: messages,
    })
  }

  return (
    <MessageContext.Provider value={{ messages, newMessage, newMessages }}>
      {props.children}
    </MessageContext.Provider>
  )
}
