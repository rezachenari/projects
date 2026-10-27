import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ProjectCard from '../cards/ProjectCard';

export default function ProjectsShowcase({ projects, loading }) {
  return (
    <section className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          eyebrow="نمونه‌کارها"
          title={<span id="projects-title">فضاهایی که به امضای برند تبدیل شدند</span>}
          lead="نگاهی به نمونه‌های طراحی و اجرای ویترین و دکور برای فضاهایی با سلیقه‌ها و نیازهای متفاوت."
          action={
            <Link className="btn btn--outline" to="/projects">
              <span>مشاهده همه پروژه‌ها</span>
              <span className="btn__icon">
                <ArrowLeft size={16} aria-hidden="true" />
              </span>
            </Link>
          }
        />

        {loading ? (
          <div className="projects__grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ minHeight: 380 }} />
            ))}
          </div>
        ) : (
          <div className="projects__grid">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 70}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
