import { gql } from "@apollo/client"

export const NEW_MESSAGE = gql`
  subscription OnNewMessage {
    newMessage {
      id
      from
      to
      body
      createdAt
    }
  }
`
