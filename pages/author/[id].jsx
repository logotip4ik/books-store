import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layouts/default';
import { useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';

export async function getServerSideProps({ params }) {
  if (isNaN(params.id) || !params.id) return { notFound: true };
  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    ssrMode: true,
    cache: new InMemoryCache({ addTypename: false }),
  });

  const { data } = await client.query({
    query: gql`
      query Query {
        getOneAuthor(id: ${params.id}) {
          id
          name
          email
          books {
            id
            title
          }
        }
      }
    `,
  });
  return {
    props: {
      author: data.getOneAuthor,
    },
  };
}

export default function Author({ author }) {
  const router = useRouter();

  const openBook = useCallback(
    (bookId) => {
      router.push(`/book/${bookId}`);
    },
    [router],
  );

  return (
    <>
      <Head>
        <title>{`${author.name} | Author`}</title>
        <meta name="description" content={`All books from: "${author.name}"`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <pre>{JSON.stringify(author, null, 2)}</pre>
      </Layout>
    </>
  );
}
