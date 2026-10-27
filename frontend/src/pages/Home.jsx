import { useSite } from '../lib/site-context';
import { useApi, useDocumentMeta } from '../lib/utils';
import Hero from '../components/home/Hero';
import Advantages from '../components/home/Advantages';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProjectsShowcase from '../components/home/ProjectsShowcase';
import WhyUs from '../components/home/WhyUs';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Process from '../components/home/Process';
import Testimonials from '../components/home/Testimonials';
import ArticlesPreview from '../components/home/ArticlesPreview';
import FinalCta from '../components/home/FinalCta';

export default function Home() {
  const { categories, loading: siteLoading } = useSite();
  const products = useApi('/products?featured=1&limit=6');
  const projects = useApi('/projects?limit=4');
  const articles = useApi('/articles?limit=4');

  useDocumentMeta({
    title: 'پارس ویترین | طراحی و ساخت ویترین، مانکن و دکور طلافروشی',
    description:
      'طراحی، ساخت و اجرای ویترین طلافروشی، مانکن طلا و جواهر، استند نمایش و دکوراسیون اختصاصی گالری‌های طلا؛ از مشاوره اولیه تا نصب نهایی.',
  });

  return (
    <>
      <Hero />
      <Advantages />
      <CategoryShowcase categories={categories} loading={siteLoading} />
      <ProjectsShowcase projects={projects.data?.projects || []} loading={projects.loading} />
      <WhyUs />
      <FeaturedProducts products={products.data?.products || []} loading={products.loading} />
      <Process />
      <Testimonials />
      <ArticlesPreview articles={articles.data?.articles || []} loading={articles.loading} />
      <FinalCta />
    </>
  );
}
