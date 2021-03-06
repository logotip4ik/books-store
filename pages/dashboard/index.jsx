import Head from 'next/head';
import cookies from 'next-cookies';
import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';
import styles from '../../styles/Dashboard.module.scss';
import useApolloClient from '../../hooks/useApolloClient';
import DashboardItem from '../../components/DashboardItem';
import Layout from '../../components/layouts/default';

function Dashboard({ user }) {
  const router = useRouter();

  const openWrittenBook = useCallback(
    (bookId) => router.push(`/dashboard/book/edit/?id=${bookId}`),
    [router],
  );
  const openStarredBook = useCallback(
    (bookId) => router.push(`/book/${bookId}`),
    [router],
  );

  return (
    <>
      <Head>
        <title>{user.name} | User</title>
      </Head>
      <Layout>
        <div className={styles.main}>
          <h1 className={styles.main__title}>Dashboard: {user.name}</h1>
          <ul className={styles.main__tags}>
            {Object.keys(user)
              .reduce(
                (acc, val) => (user[val] === true ? [...acc, val] : acc),
                [],
              )
              .map((tag, i) => (
                <li key={i} className={styles.main__tags__item}>
                  {tag}
                </li>
              ))}
          </ul>
          {user.isAuthor && (
            <DashboardItem
              list={user.books}
              header={'Written Books'}
              empty={"You don't have any written books yet"}
              onAdd={() => router.push('/dashboard/book/create')}
              onOpen={openWrittenBook}
            />
          )}
          <DashboardItem
            list={user.starredBooks}
            header={'Starred books: '}
            empty={"You don't have any starred books yet"}
            onAdd={() => router.push('/')}
            onOpen={openStarredBook}
          />
        </div>
      </Layout>
    </>
  );
}

export default Dashboard;

export async function getServerSideProps({ query, ...ctx }) {
  const cookie = cookies(ctx);
  if (!cookie._books__auth) return { redirect: { destination: '/' } };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const { data } = await client.query({
    query: gql`
      query Query {
        getMe {
          id
          name
          email
          about
          isAuthor
          isStuff
          books {
            id
            title
          }
          starredBooks {
            id
            title
          }
        }
      }
    `,
  });

  if (!data.getMe) return { redirect: { destination: '/' } };

  return {
    props: {
      user: data.getMe,
    },
  };
}
