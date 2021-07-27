import Link from 'next/link';
import styles from '../styles/Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/">
        <a>&#169;BookSStore</a>
      </Link>
      <p>
        Coded by{' '}
        <a target="_blank" href="https://bogdankostyuk.xyz" rel="noreferrer">
          BogdanKostyuk
        </a>
      </p>
    </footer>
  );
}
