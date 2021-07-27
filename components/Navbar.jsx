import { useCallback, useEffect, useState } from 'react';
import Cookies from 'cookies-js';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/Navbar.module.scss';

const variants = {
  animate: { x: 0 },
  exit: { x: 175 },
};

export default function Navbar() {
  const router = useRouter();

  const [routeName, setRouteName] = useState('');

  const handleLogout = useCallback(() => {
    Cookies.expire('_books__auth');
    router.push('/');
  }, [router]);

  useEffect(() => {
    const route = router.route.split('/');
    setRouteName(route[route.length - 1]);
  }, [router.route]);

  return (
    <AnimatePresence exitBeforeEnter>
      {routeName !== 'read' && (
        <motion.header
          className={styles.header}
          initial={{ y: -100, opacity: 0, height: 'initial' }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ height: 0, y: -80 }}
          transition={{ ease: 'easeOut' }}
        >
          <div>
            <AnimatePresence>
              {(routeName === 'create' || routeName === 'edit') && (
                <motion.button
                  className={styles.header__back}
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  exit={{ width: 0 }}
                  onClick={router.back}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M16.88,2.88L16.88,2.88c-0.49-0.49-1.28-0.49-1.77,0l-8.41,8.41c-0.39,0.39-0.39,1.02,0,1.41l8.41,8.41 c0.49,0.49,1.28,0.49,1.77,0l0,0c0.49-0.49,0.49-1.28,0-1.77L9.54,12l7.35-7.35C17.37,4.16,17.37,3.37,16.88,2.88z" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
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
          </div>
          <AnimatePresence exitBeforeEnter>
            {routeName === 'dashboard' ? (
              <motion.button
                key={1}
                variants={variants}
                initial={'exit'}
                animate={'animate'}
                exit={'exit'}
                className={styles.header__action}
                onClick={handleLogout}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
              </motion.button>
            ) : routeName === 'login' || routeName === 'sign-up' ? (
              <motion.b
                key={2}
                variants={variants}
                initial={'exit'}
                animate={'animate'}
                exit={'exit'}
              ></motion.b>
            ) : (
              <Link href="/login" passHref prefetch={true}>
                <motion.a
                  key={3}
                  className={styles.header__action}
                  variants={variants}
                  initial={'exit'}
                  animate={'animate'}
                  exit={'exit'}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
                  </svg>
                </motion.a>
              </Link>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
