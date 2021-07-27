import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { BookCard } from '../components/BookCard';
import Layout from '../components/layouts/default';
import useApolloClient from '../hooks/useApolloClient';

export async function getServerSideProps({ query, ...ctx }) {
  // Yep, even if page is 0 we will set it for 1
  const page =
    isNaN(query.page) || query.page == '0' ? 1 : parseInt(query.page);
  const { per_page } = process.env;

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const offset = (page - 1) * per_page;

  const { data } = await client.query({
    query: gql`
      query Query {
        getAllBooks(first: ${per_page}, offset: ${offset}) {
          id
          title
          image
          author {
            id
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
      currPage: page - 1,
    },
  };
}

export default function Home({ books, pages, currPage }) {
  const router = useRouter();

  const handleClick = useCallback(
    (data) => {
      let { selected } = data;
      router.push(`/?page=${selected + 1}`);
    },
    [router],
  );

  return (
    <>
      <Head>
        <title>BookS</title>
        <meta name="description" content="Read your books even offline!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container container--full-height">
          {books.map((book) => (
            <BookCard key={book.id} book={book}></BookCard>
          ))}
        </div>
        <div className={'pagination-container'}>
          <ReactPaginate
            initialPage={currPage}
            previousLabel={'←'}
            nextLabel={'→'}
            pageCount={pages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={(ev) => handleClick(ev)}
            containerClassName={'pagination'}
          />
        </div>
      </Layout>
    </>
  );
}
