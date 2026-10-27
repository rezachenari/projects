import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { SiteProvider } from './lib/site-context';
import Home from './pages/Home';
import Products from './pages/Products';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Contact from './pages/Contact';
import Consultation from './pages/Consultation';
import NotFound from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <SiteProvider>
      <ScrollManager />
      <a className="skip-link" href="#main">
        پرش به محتوای اصلی
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </SiteProvider>
  );
}
