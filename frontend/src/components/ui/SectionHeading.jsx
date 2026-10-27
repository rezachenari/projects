import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  action = null,
  align = 'start',
  level = 2,
  as = 'header',
}) {
  const Heading = `h${level}`;
  return (
    <Reveal as={as} className={`section-head ${align === 'center' ? 'section-head--center' : ''}`}>
      <div className="section-head__text">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Heading className="section-head__title">{title}</Heading>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {action}
    </Reveal>
  );
}
