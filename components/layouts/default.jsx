import { motion } from 'framer-motion';

const variants = {
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Layout({ children }) {
  return (
    <motion.main
      initial={'exit'}
      animate={'enter'}
      exit={'exit'}
      variants={variants}
      style={{
        paddingTop: '1rem',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {children}
    </motion.main>
  );
}
