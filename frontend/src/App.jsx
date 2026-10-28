import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Reservation from './pages/Reservation';
import NotFound from './pages/NotFound';
import { useSite } from './lib/site-context';
import { scrollToSection } from './lib/scroll';

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // A hash target inside a pinned cinematic world needs to be entered a little
    // way into its travel; `scrollToSection` knows the difference.
    if (hash && scrollToSection(hash.slice(1))) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { settings } = useSite();

  return (
    <>
      <RouteEffects />
      <Header settings={settings} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer settings={settings} />
    </>
  );
}
