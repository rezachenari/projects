import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <Link className="project-card" to={`/projects/${project.slug}`} aria-label={`${project.title} — مشاهده پروژه`}>
      <div className="project-card__media">
        <img
          src={project.image_url}
          alt={project.image_alt || project.title}
          loading="lazy"
          decoding="async"
          width="900"
          height="675"
        />
      </div>
      {project.is_demo ? <span className="badge project-card__badge">نمونه طراحی</span> : null}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__meta">
          {[project.location, project.service_type].filter(Boolean).join(' · ')}
        </p>
        <span className="project-card__cta">
          <span>مشاهده پروژه</span>
          <ArrowLeft size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
