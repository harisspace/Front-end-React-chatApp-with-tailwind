import { gql } from "@apollo/client"

export const GET_USERS = gql`
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

export const GET_MESSAGES = gql`
  query GetMessages($userId: ID!, $to: ID!, $offset: Int) {
    getMessages(userId: $userId, to: $to, offset: $offset) {
      id
      from
      to
      createdAt
      body
    }
  }
`

export const GET_USERS_MESSAGE = gql`
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
