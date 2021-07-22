import Navbar from '../Navbar';
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '1rem' }}>{children}</main>
      <Footer />
    </>
  );
}
