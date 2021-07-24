import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { AnimatePresence } from 'framer-motion';
import { ApolloProvider } from '@apollo/client';
import useApolloClient from '../hooks/useApolloClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.scss';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, router, ...ctx }) {
  const client = useApolloClient(ctx);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/nprogress@0.2.0/nprogress.css"
        />
      </Head>
      <Navbar />
      <ApolloProvider client={client}>
        <AnimatePresence
          exitBeforeEnter
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </ApolloProvider>
      <Footer />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
