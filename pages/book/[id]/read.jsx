import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import styles from '../../../styles/Read.module.scss';

function BookRead({ book }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{book.title}</h3>
      <small className={styles.author}>{book.author.name}</small>
      <p className={styles.epilogue}>{book.epilogue}</p>
      <p className={styles.text}>{book.content}</p>
    </div>
  );
}

export default BookRead;

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
        getOneBook(id: ${params.id}) {
          id
          title
          epilogue
          content
          createdAt
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
