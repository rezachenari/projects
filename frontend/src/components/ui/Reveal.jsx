import useReveal from '../../lib/useReveal';

export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const { ref, visible } = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
