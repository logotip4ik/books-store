import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import cookies from 'next-cookies';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import styles from '../../../styles/Book.module.scss';
import Layout from '../../../components/layouts/default';
import { useCallback, useState, useEffect } from 'react';
import useApolloClient from '../../../hooks/useApolloClient';

export async function getServerSideProps({ params, ...ctx }) {
  if (isNaN(params.id) || !params.id) return { notFound: true };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const { data: Book } = await client.query({
    query: gql`
      query Query {
        getOneBook(id: ${params.id}) {
          id
          title
          image
          epilogue
          author {
            id
            name
            books {
              id
              title
            }
          }
          createdAt
        }
      }
    `,
  });

  const { _books__auth } = cookies(ctx);

  if (!_books__auth)
    return {
      props: { book: Book.getOneBook, starred: false },
    };

  const { data: Me } = await client.query({
    query: gql`
      query Query {
        getMe {
          id
          name
          starredBooks {
            id
            title
          }
        }
      }
    `,
  });

  const starred = Me.getMe.starredBooks.filter(
    (item) => item.id === Book.getOneBook.id,
  )[0];

  return {
    props: {
      book: Book.getOneBook,
      me: Me.getMe,
      isStarred: !!starred,
    },
  };
}

const STAR_BOOK = gql`
  mutation Mutation($id: Int!) {
    starBook(data: { id: $id }) {
      success
    }
  }
`;
const UN_STAR_BOOK = gql`
  mutation Mutation($id: Int!) {
    unStarBook(data: { id: $id }) {
      success
    }
  }
`;

export default function Book({ book, me, isStarred }) {
  const router = useRouter();

  const [starred, setStarred] = useState(isStarred);
  const [otherBooks, setOtherBooks] = useState([]);

  const [starBook] = useMutation(STAR_BOOK);
  const [unStarBook] = useMutation(UN_STAR_BOOK);

  const toggleStar = useCallback(() => {
    const variables = { id: book.id };
    if (starred)
      return unStarBook({ variables }).then(() => setStarred(!starred));
    starBook({ variables }).then(() => setStarred(!starred));
  }, [book, starred, starBook, unStarBook]);

  const openBook = useCallback(
    (bookId) => router.push(`/book/${bookId}`),
    [router],
  );

  useEffect(() => {
    setOtherBooks(book.author.books.filter(({ id }) => id !== book.id));
  }, []);

  return (
    <>
      <Head>
        <title>{book.title}</title>
        <meta
          name="description"
          content={`"${book.title}" - by ${book.author.name}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.main}>
          <Image
            src={book.image}
            width={520}
            height={520}
            alt={`Image for ${book.title}`}
            className={styles.main__image}
          />
          <div className={styles.main__content}>
            <h2 className={styles.main__content__title}>{book.title}</h2>
            <p className={styles.main__content__desc}>{book.epilogue}</p>
            <p className={styles.main__content__by}>
              By -{' '}
              <Link href={`/author/${book.author.id}`}>{book.author.name}</Link>
            </p>
            <div className={styles.main__content__actions}>
              {me ? (
                <button
                  onClick={toggleStar}
                  className={starred ? `starred` : styles.star}
                >
                  {starred ? 'Starred' : 'Star'}{' '}
                  {starred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                    </svg>
                  )}
                </button>
              ) : (
                <Link href="/login">
                  <a className={styles.star}>
                    Star{' '}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                    </svg>
                  </a>
                </Link>
              )}
              <Link href={`/book/${book.id}/read`}>Read</Link>
            </div>
          </div>
        </div>
        <div className={styles.slider__container}>
          <h3 className={styles.slider__title}>
            {otherBooks.length !== 0
              ? `Another Books from ${book.author.name}:`
              : `"${book.author.name}" does not have other books`}
          </h3>
          {otherBooks.length !== 0 && (
            <ul className="slider">
              {book.author.books
                .filter(({ id }) => id !== book.id)
                .map((item) => (
                  <li
                    key={item.id}
                    className="slider__item"
                    onClick={() => openBook(item.id)}
                  >
                    {item.title}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </Layout>
    </>
  );
}
