import styles from '../styles/BookCard.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

export function BookCard({ book }) {
  const router = useRouter();

  const openBook = useCallback(
    ({ target }) => {
      const { nodeName } = target;
      if (nodeName == 'IMG' || nodeName == 'DIV')
        router.push(`/book/${book.id}`);
    },
    [book, router],
  );

  return (
    <article className={styles.article} onClick={openBook}>
      <Image
        src={book.image}
        width="320"
        height="320"
        alt={`Image for "${book.title}"`}
        className={styles.article__image}
      />
      <div className={styles.article__content}>
        <Link href={`/book/${book.id}`} scroll={false}>
          <a className={styles.article__content__title}>{book.title}</a>
        </Link>
        <p className={styles.article__content__by}>
          By -{' '}
          <Link href={`/author/${book.author.id}`} passHref scroll={false}>
            {book.author.name}
          </Link>
        </p>
      </div>
      <div className={styles.article__actions}>
        {/* TODO: Create a link to star this book */}
        <Link href={`/book/${book.id}/read`} scroll={false}>
          Read &rarr;
        </Link>
      </div>
    </article>
  );
}
