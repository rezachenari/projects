import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import JsonLd from '../components/ui/JsonLd';
import { useApi, useDocumentMeta } from '../lib/utils';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, loading, error, retry } = useApi(`/projects/${encodeURIComponent(slug)}`);
  const project = data?.project || null;

  useDocumentMeta({
    title: project ? `${project.title} | نمونه‌کار پارس ویترین` : 'جزئیات پروژه | پارس ویترین',
    description: project?.summary || 'جزئیات نمونه‌کار طراحی و اجرای ویترین و دکور.',
  });

  if (loading) {
    return (
      <section className="section section--dark">
        <div className="container">
          <div className="skeleton" style={{ minHeight: 420 }} />
        </div>
      </section>
    );
  }

  if (error?.status === 404) return <NotFound />;

  if (error || !project) {
    return (
      <section className="section section--dark">
        <div className="container">
          <div className="empty-state">
            <strong>اطلاعات پروژه بارگذاری نشد.</strong>
            <p>{error?.message}</p>
            <button className="btn btn--outline" type="button" onClick={retry}>
              تلاش دوباره
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          about: project.service_type,
          locationCreated: project.location,
        }}
      />

      <section className="project-hero">
        <div className="project-hero__media">
          <img src={project.image_url} alt={project.image_alt || project.title} width="1600" height="900" />
        </div>
        <div className="container">
          <div className="project-hero__copy">
            <Breadcrumbs items={[{ label: 'پروژه‌ها', to: '/projects' }, { label: project.title }]} />
            <h1>{project.title}</h1>
            <div className="project-meta">
              {project.location ? <span className="project-meta__item">{project.location}</span> : null}
              {project.service_type ? <span className="project-meta__item">{project.service_type}</span> : null}
              {project.style ? <span className="project-meta__item">{project.style}</span> : null}
              {project.is_demo ? <span className="badge">نمونه طراحی</span> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="why__layout" style={{ alignItems: 'start' }}>
            <div className="prose">
              <p>{project.summary}</p>
              {(project.body || []).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <aside style={{ display: 'grid', gap: '1.25rem' }}>
              {project.scope?.length ? (
                <div className="contact-card" style={{ background: 'var(--ink-800)', borderColor: 'rgba(247,245,240,0.08)' }}>
                  <h2 className="footer__title" style={{ color: 'var(--gold-500)' }}>
                    دامنه خدمات این پروژه
                  </h2>
                  <ul style={{ display: 'grid', gap: '0.65rem', marginTop: '0.9rem' }}>
                    {project.scope.map((item) => (
                      <li key={item} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.87rem', color: 'rgba(247,245,240,0.78)' }}>
                        <Check size={16} color="#D6AD62" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="cta-band" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div className="cta-band__text">
                  <span className="cta-band__title">پروژه‌ای مشابه در ذهن دارید؟</span>
                  <span className="cta-band__desc">ابعاد و سبک فضای خود را بگویید تا گزینه‌های اجرایی را بررسی کنیم.</span>
                </div>
                <Link className="btn btn--gold" to="/consultation">
                  <span>درخواست مشاوره</span>
                  <span className="btn__icon">
                    <ArrowLeft size={16} aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
