import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import cookies from 'next-cookies';

function useApolloClient(ctx) {
  const { _books__auth: token } = cookies(ctx);

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? 'https://books-servver.herokuapp.com/'
        : 'http://localhost:4000/',
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ addTypename: false }),
  });
}

export default useApolloClient;
