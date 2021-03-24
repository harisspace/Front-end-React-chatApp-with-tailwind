import { gql } from "@apollo/client"

export const SEND_MESSAGE = gql`
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
