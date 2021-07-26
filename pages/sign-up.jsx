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
import Layout from '../components/layouts/default';
import { motion, AnimatePresence } from 'framer-motion';

const errorTextVariants = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const SIGNUP = gql`
  mutation Mutation(
    $name: String!
    $about: String
    $email: String!
    $isAuthor: Boolean!
    $password: String!
  ) {
    createUser(
      data: {
        name: $name
        about: $about
        isAuthor: $isAuthor
        email: $email
        password: $password
      }
    ) {
      token
    }
  }
`;

function SingUp() {
  const router = useRouter();

  const [singUp, { data }] = useMutation(SIGNUP);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      isAuthor: false,
      password: '',
      about: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      isAuthor: Yup.bool().notRequired(),
      about: Yup.string().when('isAuthor', {
        is: true,
        then: Yup.string()
          .min(1, 'Must be at least 1 character')
          .max(500, 'Must be less then 500 characters')
          .required('Required'),
      }),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),

    onSubmit: (values) => {
      NProgress.start();
      formik.resetForm();
      NProgress.inc();

      singUp({ variables: { ...values } })
        .then(({ data }) => {
          //             sec  min  hour days
          const expires = 60 * 60 * 24 * 7;
          Cookies.set('_books__auth', data.createUser.token, { expires });
          router.push('/dashboard');
        })
        .catch((err) => {
          console.warn({ err });
          formik.resetForm({
            status: 'error',
            errors: Object.keys(formik.values).reduce(
              (acc, val) => ({ ...acc, [val]: err.message }),
              {},
            ),
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
            <h2 className={styles.main__title}>Sign up</h2>
            <form
              className={styles.main__form}
              onSubmit={formik.handleSubmit}
              onReset={formik.handleReset}
            >
              <div className={styles.main__form__item}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  {...formik.getFieldProps('name')}
                />
                <AnimatePresence exitBeforeEnter>
                  {formik.touched.name && formik.errors.name ? (
                    <motion.small
                      key={1}
                      variants={errorTextVariants}
                      initial={'exit'}
                      animate={'animate'}
                      exit={'exit'}
                    >
                      {formik.errors.name}
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
              <div className={styles['main__form__item--checkbox']}>
                <label htmlFor="author">Are you author?</label>
                <input
                  id="author"
                  type="checkbox"
                  value={formik.values.isAuthor}
                  className={styles.main__form__item__checkbox}
                  {...formik.getFieldProps('isAuthor')}
                />
              </div>
              <AnimatePresence exitBeforeEnter>
                {formik.values.isAuthor && (
                  <motion.div
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                    className={styles.main__form__item}
                  >
                    <label htmlFor="about">Tell us about yourself:</label>
                    <textarea
                      id="about"
                      type="text"
                      {...formik.getFieldProps('about')}
                    />
                    <AnimatePresence exitBeforeEnter>
                      {formik.touched.about && formik.errors.about ? (
                        <motion.small
                          key={1}
                          variants={errorTextVariants}
                          initial={'exit'}
                          animate={'animate'}
                          exit={'exit'}
                        >
                          {formik.errors.about}
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
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={styles.main__form__actions}>
                <button type="submit">Login</button>
                <button type="reset">Reset</button>
              </div>
            </form>
            <p className={styles.main__create}>
              Already have an account?
              <br />
              <Link href="/login" prefetch={true}>
                <a>Log in!</a>
              </Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SingUp;
