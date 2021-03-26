import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink,
  split,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"

import App from "./App"

let httpLink = new HttpLink({
  uri: "http://localhost:4000",
})

const authLink = setContext((_, { headers }) => {
  // get token from local storage if exist
  const token = localStorage.getItem("jwtToken")
  // console.log(headers)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// websocket connection
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    timeout: 3000,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  },
})

httpLink = authLink.concat(httpLink)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getMessages: {
          keyArgs: false,
          merge(existing, incoming, { args: { offset = 0, to, userId } }) {
            // Slicing is necessary because the existing data is
            // immutable, and frozen in development.
            console.log(to, userId)
            const merged = existing ? existing.slice(0) : []
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i]
            }
            return merged
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  link: splitLink,
  cache,
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
