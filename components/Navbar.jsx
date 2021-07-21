import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.header__title}>BookStore</a>
      </Link>
      <Link href="/login">
        <a className={styles.header__login}>
          <svg viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
          </svg>
        </a>
      </Link>
    </header>
  );
}
