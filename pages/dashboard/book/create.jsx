import * as Yup from 'yup';
import Head from 'next/head';
import NProgress from 'nprogress';
import cookies from 'next-cookies';
import { useFormik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../../../components/layouts/default';
import styles from '../../../styles/CreateBook.module.scss';
import useApolloClient from '../../../hooks/useApolloClient';

const errorTextVariants = {
  exit: { opacity: 0 },
  animate: { opacity: 1 },
};

const CREATE_BOOK = gql`
  mutation Mutation(
    $title: String!
    $content: String!
    $epilogue: String!
    $image: String!
    $author: Int!
  ) {
    createBook(
      data: {
        title: $title
        content: $content
        epilogue: $epilogue
        image: $image
        author: $author
      }
    ) {
      id
      title
      epilogue
      author {
        id
        name
      }
      image
      createdAt
    }
  }
`;

function Create({ user }) {
  const [createBook, { data: BookData }] = useMutation(CREATE_BOOK);

  const formik = useFormik({
    initialValues: {
      title: '',
      epilogue: '',
      content: '',
      image: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
      epilogue: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .max(1000, 'Must be 1000 characters or less')
        .required('Required'),
      content: Yup.string()
        .min(1, 'Must be at least 2 characters')
        .required('Required'),
      image: Yup.string().url('Must be url type').required('Required'),
    }),

    onSubmit: (values) => {
      NProgress.start();
      createBook({ variables: { ...values, author: user.id } }).finally(
        (val) => {
          NProgress.done();
          console.log(val);
        },
      );
    },
  });

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
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps('title')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.title && formik.errors.title ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.title}
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
              <label htmlFor="image">Image</label>
              <input
                id="image"
                autoComplete="off"
                type="url"
                {...formik.getFieldProps('image')}
              />
              <AnimatePresence exitBeforeEnter>
                {formik.touched.image && formik.errors.image ? (
                  <motion.small
                    key={1}
                    variants={errorTextVariants}
                    initial={'exit'}
                    animate={'animate'}
                    exit={'exit'}
                  >
                    {formik.errors.image}
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
              <label htmlFor="epilogue">Epilogue</label>
              <textarea
                id="epilogue"
                rows="4"
                autoComplete="off"
                type="text"
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
                autoComplete="off"
                type="text"
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
