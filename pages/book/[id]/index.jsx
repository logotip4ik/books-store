import { gql } from '@apollo/client';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../../styles/Book.module.scss';
import Layout from '../../../components/layouts/default';
import { useCallback } from 'react';
import { useRouter } from 'next/dist/client/router';
import useApolloClient from '../../../hooks/useApolloClient';

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
  return {
    props: {
      book: data.getOneBook,
    },
  };
}

export default function Book({ book }) {
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
              <Link href={`/book/${book.id}/read`}>Read</Link>
              {/* TODO: Add button for read later(if has cookie -> link to dashboard else -> link to login or sign ip) */}
            </div>
          </div>
        </div>
        <div className={styles.slider__container}>
          <h3 className={styles.slider__title}>
            Another Books from {book.author.name}:
          </h3>
          <motion.ul className={styles.slider}>
            {book.author.books.map((item) => (
              <motion.li
                key={item.id}
                className={styles.slider__item}
                onClick={() => openBook(item.id)}
              >
                {item.title}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Layout>
    </>
  );
}
