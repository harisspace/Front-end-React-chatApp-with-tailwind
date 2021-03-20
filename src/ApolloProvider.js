import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import App from './App'

const httpLink = new HttpLink({
   uri: 'http://localhost:4000'
})

const authLink = setContext((_, { headers }) => {
   // get token from local storage if exist
   const token = localStorage.getItem('jwtToken')
   // console.log(headers)
   return {
       headers: {
           ...headers,
           authorization: token ? `Bearer ${token}` : ''
       }
   }
})

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache()
})

export default (
   <ApolloProvider client={client}>
      <App />
   </ApolloProvider>
)