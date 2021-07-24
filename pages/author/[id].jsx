import { gql } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layouts/default';
import styles from '../../styles/Author.module.scss';
import useApolloClient from '../../hooks/useApolloClient';

export async function getServerSideProps({ params, ctx }) {
  if (isNaN(params.id) || !params.id) return { notFound: true };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const { data } = await client.query({
    query: gql`
      query Query {
        getOneAuthor(id: ${params.id}) {
          id
          name
          email
          about
          books {
            id
            title
            epilogue
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
  return (
    <>
      <Head>
        <title>{`${author.name} | Author`}</title>
        <meta name="description" content={`All books from: "${author.name}"`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.main}>
          <h2 className={styles.main__title}>{author.name}</h2>
          <p className={styles.main__about}>{author.about}</p>
          <a className={styles.main__contact} href={`mailto: ${author.email}`}>
            Contact {author.name}
          </a>
          <ol className={styles.main__books}>
            {author.books.map((book) => (
              <li key={book.id} className={styles.main__books__item}>
                <div>
                  <h3 className={styles.main__books__item__title}>
                    {book.title}
                  </h3>
                  <small className={styles.main__books__item__epilogue}>
                    {book.epilogue.split(' ').slice(0, 5).join(' ')}...
                  </small>
                </div>
                <Link href={`/book/${book.id}`}>View</Link>
              </li>
            ))}
          </ol>
        </div>
      </Layout>
    </>
  );
}
