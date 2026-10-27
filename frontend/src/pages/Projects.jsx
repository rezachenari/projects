import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProjectCard from '../components/cards/ProjectCard';
import Reveal from '../components/ui/Reveal';
import { useApi, useDocumentMeta } from '../lib/utils';

export default function Projects() {
  const { data, loading, error, retry } = useApi('/projects');
  const projects = data?.projects || [];

  useDocumentMeta({
    title: 'نمونه‌کارها | طراحی و اجرای دکور طلافروشی',
    description:
      'نمونه‌های طراحی و اجرای ویترین، مانکن و دکوراسیون گالری‌های طلا و جواهر؛ با تمرکز بر متریال، نورپردازی و جزئیات اجرایی.',
  });

  return (
    <>
      <section className="page-head">
        <div className="container page-head__inner">
          <Breadcrumbs items={[{ label: 'پروژه‌ها' }]} />
          <h1>نمونه‌کارهای اجرا شده</h1>
          <p className="lead">
            هر پروژه با شرایط فضای خودش شکل می‌گیرد. این نمونه‌ها نشان می‌دهند چگونه سبک، متریال و نورپردازی در
            فضاهای مختلف کنار هم قرار می‌گیرند.
          </p>
        </div>
      </section>

      <section className="section projects">
        <div className="container">
          {loading ? (
            <div className="projects__grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="skeleton" key={index} style={{ minHeight: 380 }} />
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <strong>فهرست پروژه‌ها بارگذاری نشد.</strong>
              <p>{error.message}</p>
              <button className="btn btn--outline" type="button" onClick={retry}>
                تلاش دوباره
              </button>
            </div>
          ) : (
            <div className="projects__grid">
              {projects.map((project, index) => (
                <Reveal key={project.slug} delay={(index % 2) * 70}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}

          <p className="testimonials__note" style={{ color: 'var(--steel-400)' }}>
            <Info size={15} aria-hidden="true" />
            نمونه‌های این بخش به‌عنوان «نمونه طراحی» معرفی شده‌اند و ادعای اجرای واقعی برای مشتری مشخصی ندارند.
          </p>

          <div style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="cta-band">
              <div className="cta-band__text">
                <span className="cta-band__title">فضای فروشگاه شما با کدام سبک هم‌خوان است؟</span>
                <span className="cta-band__desc">
                  سبک مورد نظرتان را بگویید تا نمونه‌های نزدیک به آن و گزینه‌های اجرایی را بررسی کنیم.
                </span>
              </div>
              <Link className="btn btn--gold" to="/consultation">
                دریافت مشاوره طراحی
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
