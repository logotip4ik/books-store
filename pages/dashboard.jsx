import cookies from 'next-cookies';
import useApolloClient from '../hooks/useApolloClient';

function Dashboard({ justtest }) {
  return <div>{JSON.stringify({ justtest }, null, 2)}</div>;
}

export default Dashboard;

export async function getServerSideProps({ query, ...ctx }) {
  const cookie = cookies(ctx);
  if (!cookie._books__auth) return { redirect: { destination: '/' } };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  return {
    props: {
      justtest: 'test',
    },
  };
}
