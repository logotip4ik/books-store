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

  const [isReadRoute, setIsReadRoute] = useState(false);
  const [isLoginRoute, setIsLoginRoute] = useState(false);
  const [isSignUpRoute, setIsSignUpRoute] = useState(false);
  const [isDashboardRoute, setIsDashboardRoute] = useState(false);

  const handleLogout = useCallback(() => {
    Cookies.expire('_books__auth');
    router.push('/');
  }, [router]);

  useEffect(() => {
    setIsReadRoute(router.route.split('/').includes('read'));
    setIsLoginRoute(router.route.split('/').includes('login'));
    setIsSignUpRoute(router.route.split('/').includes('sign-up'));
    setIsDashboardRoute(router.route.split('/').includes('dashboard'));
  }, [router.route]);

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
          <AnimatePresence exitBeforeEnter>
            {isDashboardRoute ? (
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
            ) : isLoginRoute || isSignUpRoute ? (
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
