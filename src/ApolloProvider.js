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

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
