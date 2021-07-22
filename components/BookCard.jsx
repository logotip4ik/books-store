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
        <Link href={`/book/${book.id}`}>
          <a className={styles.article__content__title}>{book.title}</a>
        </Link>
        {/* TODO: Create a link to this author */}
        <p className={styles.article__content__by}>
          By - <em>{book.author.name}</em>
        </p>
      </div>
      <div className={styles.article__actions}>
        {/* TODO: Create a link to star this book */}
        <Link href={`/book/${book.id}/read`}>
          <a>Read &rarr;</a>
        </Link>
      </div>
    </article>
  );
}
