import { gql } from '@apollo/client';
import useApolloClient from '../../../hooks/useApolloClient';
import Head from 'next/head';
import styles from '../../../styles/Read.module.scss';

function BookRead({ book }) {
  return (
    <>
      <Head>
        <title>{'Read |' + book.title}</title>
        <meta
          name="description"
          content={`"${book.title}" - by ${book.author.name}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h3 className={styles.title}>{book.title}</h3>
        <small className={styles.author}>{book.author.name}</small>
        <p className={styles.epilogue}>{book.epilogue}</p>
        <p className={styles.text}>{book.content}</p>
      </div>
    </>
  );
}

export default BookRead;

export async function getServerSideProps({ params, ...ctx }) {
  if (isNaN(params.id) || !params.id) return { notFound: true };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const { data } = await client.query({
    query: gql`
      query Query {
        getOneBook(id: ${params.id}) {
          id
          title
          epilogue
          content
          author {
            name
          }
        }
      }
    `,
  });

  return {
    props: {
      book: data.getOneBook,
    },
  };
}
