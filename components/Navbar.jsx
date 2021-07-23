import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';

export default function Navbar() {
  const router = useRouter();
  const [isReadRoute, setIsReadRoute] = useState(false);

  useEffect(() => {
    setIsReadRoute(router.route.split('/').includes('read'));
  });

  Router.events.on('routeChangeComplete', (route) =>
    setIsReadRoute(route.split('/').includes('read')),
  );

  return (
    <AnimatePresence exitBeforeEnter>
      {!isReadRoute && (
        <motion.header
          className={styles.header}
          initial={{ y: -100, opacity: 0, height: 'initial' }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ height: 0, y: -80 }}
          transition={{ ease: 'easeOut' }}
        >
          <Link href="/" passHref>
            <motion.a
              className={styles.header__title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              BookS
            </motion.a>
          </Link>
          <Link href="/login" passHref>
            <motion.a
              className={styles.header__login}
              initial={{ x: 175 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.75, ease: 'easeOut' }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
              </svg>
            </motion.a>
          </Link>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
