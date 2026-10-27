import { Link } from 'react-router-dom';

/** The brand mark: a showcase frame holding a faceted stone. */
export function BrandMark({ size = 34, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 2.5 37.5 20 20 37.5 2.5 20 20 2.5Z" stroke="#D6AD62" strokeWidth="1.1" />
      <path d="M20 9.5 30.5 20 20 30.5 9.5 20 20 9.5Z" stroke="rgba(214,173,98,0.55)" strokeWidth="0.9" />
      <path d="M20 15.5 24.5 20 20 24.5 15.5 20 20 15.5Z" fill="#D6AD62" fillOpacity="0.9" />
      <path d="M20 2.5V7.4M20 32.6v4.9M2.5 20h4.9M32.6 20h4.9" stroke="rgba(214,173,98,0.5)" strokeWidth="0.8" />
    </svg>
  );
}

export default function Brand({ name = 'پارس ویترین', subtitle = 'ویترین و مانکن طلا', onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label={`${name} — صفحه اصلی`}>
      <BrandMark className="brand__mark" />
      <span className="brand__text">
        <span className="brand__name">{name}</span>
        <span className="brand__sub">{subtitle}</span>
      </span>
    </Link>
  );
}
