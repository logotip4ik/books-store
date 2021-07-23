import { motion } from 'framer-motion';
import styles from '../styles/BookCard.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export function BookCard({ book }) {
  return (
    <article className={styles.article}>
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
          <Link href={`/author/${book.author.id}`} passHref>
            <a>{book.author.name}</a>
          </Link>
        </p>
      </div>
      <div className={styles.article__actions}>
        {/* TODO: Create a link to star this book */}
        <Link href={`/book/${book.id}/read`} scroll={false}>
          <a>Read &rarr;</a>
        </Link>
      </div>
    </article>
  );
}
