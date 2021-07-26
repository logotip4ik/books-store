import * as Yup from 'yup';
import Head from 'next/head';
import NProgress from 'nprogress';
import cookies from 'next-cookies';
import { useFormik } from 'formik';
import { gql } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../../../components/layouts/default';
import styles from '../../../styles/CreateBook.module.scss';
import useApolloClient from '../../../hooks/useApolloClient';
import { useCallback } from 'react';

const errorTextVariants = {
  exit: { opacity: 0 },
  animate: { opacity: 1 },
};

function Create() {
  const formik = useFormik({
    initialValues: {
      name: '',
      epilogue: '',
      content: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
      epilogue: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .max(500, 'Must be 500 characters or less')
        .required('Required'),
      content: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .required('Required'),
    }),

    onSubmit: (values) => {
      // TODO: Handle submit, by mutating the graphql
      formik.resetForm();
      NProgress.start();
      NProgress.inc();
      NProgress.done();
    },
  });

  const resize = useCallback(({ target }) => {
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 2 + 'px';
  }, []);

  return (
    <>
      <Head>
        <title>Create book</title>
        <meta name="description" content="Create book, if you are logged in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className={styles.main}>
          <h2 className={styles.main__title}>New Book</h2>
          <form
            className={styles.main__form}
            onSubmit={formik.handleSubmit}
            onReset={formik.handleReset}
          >
            <div className={styles.main__form__item}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" {...formik.getFieldProps('name')} />
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
              <label htmlFor="epilogue">Email Address</label>
              <textarea
                id="epilogue"
                rows="4"
                type="text"
                onKeyPress={resize}
                {...formik.getFieldProps('epilogue')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.epilogue && formik.errors.epilogue ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.epilogue}
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
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                rows="10"
                type="text"
                onKeyPress={resize}
                {...formik.getFieldProps('content')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.content && formik.errors.content ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.content}
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
              <button type="submit">Save</button>
              <button type="reset">Reset</button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default Create;

export async function getServerSideProps({ query, ...ctx }) {
  const cookie = cookies(ctx);
  if (!cookie._books__auth) return { redirect: { destination: '/' } };

  // eslint-disable-next-line
  const client = useApolloClient(ctx);

  const { data } = await client.query({
    query: gql`
      query Query {
        getMe {
          id
          name
          isAuthor
        }
      }
    `,
  });

  if (!data.getMe || !data.getMe.isAuthor)
    return { redirect: { destination: '/' } };

  return {
    props: {
      user: data.getMe,
    },
  };
}
