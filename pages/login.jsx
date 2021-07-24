import styles from '../styles/Login.module.scss';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import Link from 'next/link';
import Head from 'next/head';
import { useMutation, gql } from '@apollo/client';
import NProgress from 'nprogress';
import Cookies from 'cookies-js';
import { useState } from 'react';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';

const errorTextVariants = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    loginAuthor(data: { email: $email, password: $password }) {
      token
    }
  }
`;

function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [login, { data }] = useMutation(LOGIN);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);
      NProgress.start();
      formik.resetForm();
      NProgress.inc();
      login({ variables: { ...values } })
        .then(({ data }) => {
          //             sec  min  hour days
          const expires = 60 * 60 * 24 * 7;
          Cookies.set('_books__auth', data.loginAuthor.token, { expires });
          router.push('/dashboard');
        })
        .catch((err) => {
          formik.resetForm({
            status: 'error',
            errors: { email: err.message, password: err.message },
          });
        })
        .finally(() => {
          setLoading(false);
          NProgress.done();
        });
    },
  });
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && <div className={styles.loading}></div>}
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h2 className={styles.main__title}>Log in</h2>
          <form
            className={styles.main__form}
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <div className={styles.main__form__item}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.email && formik.errors.email ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.email}
                  </motion.small>
                ) : (
                  <motion.b
                    key={2}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    &nbsp;
                  </motion.b>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.main__form__item}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps('password')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.password && formik.errors.password ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.password}
                  </motion.small>
                ) : (
                  <motion.b
                    key={2}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    &nbsp;
                  </motion.b>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.main__form__actions}>
              <button type="submit">Login</button>
              <button type="reset">Reset</button>
            </div>
          </form>
          <p className={styles.main__create}>
            Don&apos;t have an account yet?
            <br />
            {/* TODO: Create sign up route */}
            <Link href="/sign-up">
              <a>Create one!</a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;

export async function getServerSideProps(ctx) {
  const cookie = cookies(ctx);
  if (cookie._books__auth) return { redirect: { destination: '/dashboard' } };
  return { props: {} };
}
