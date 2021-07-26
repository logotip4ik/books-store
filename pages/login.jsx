import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'cookies-js';
import { useState } from 'react';
import NProgress from 'nprogress';
import { useFormik } from 'formik';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.scss';
import { useMutation, gql } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layouts/default';

const errorTextVariants = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    loginUser(data: { email: $email, password: $password }) {
      token
    }
  }
`;

function Login() {
  const router = useRouter();

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
      NProgress.start();
      formik.resetForm();
      NProgress.inc();
      login({ variables: { ...values } })
        .then(({ data }) => {
          //             sec  min  hour days
          const expires = 60 * 60 * 24 * 7;
          Cookies.set('_books__auth', data.loginUser.token, { expires });
          router.push('/dashboard');
        })
        .catch((err) => {
          formik.resetForm({
            status: 'error',
            errors: { email: err.message, password: err.message },
          });
        })
        .finally(() => {
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
      <Layout>
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
              <Link href="/sign-up" prefetch={true}>
                <a>Create one!</a>
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Login;

export async function getServerSideProps(ctx) {
  const cookie = cookies(ctx);
  if (cookie._books__auth) return { redirect: { destination: '/dashboard' } };
  return { props: {} };
}
