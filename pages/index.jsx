import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import { BookCard } from '../components/BookCard';
// import Image from 'next/image'
// import styles from '../styles/Home.module.css';
import Layout from '../components/layouts/default';

export async function getServerSideProps({ query }) {
  // Yep, even if page is 0 we will set it for 1
  const page = isNaN(query.page) || !query.page ? 1 : parseInt(query.page);
  const { per_page } = process.env;

  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    ssrMode: true,
    cache: new InMemoryCache({ addTypename: false }),
  });

  const offset = (page - 1) * per_page;

  const { data } = await client.query({
    query: gql`
      query Query {
        getAllBooks(first: ${per_page}, offset: ${offset}) {
          id
          title
          image
          author {
            name
          }
          createdAt
        }
      }
    `,
  });
  const { data: lastBook } = await client.query({
    query: gql`
      query Query {
        getAllBooks(first: -1) {
          id
        }
      }
    `,
  });

  return {
    props: {
      books: data.getAllBooks,
      pages: Math.ceil(lastBook.getAllBooks[0].id / per_page),
    },
  };
}

export default function Home({ books, pages }) {
  return (
    <Layout>
      <Head>
        <title>BookS</title>
        <meta name="description" content="Read your books even offline!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        {books.map((book) => (
          <BookCard key={book.id} book={book}></BookCard>
        ))}
      </div>
      {pages}
    </Layout>
  );
}
