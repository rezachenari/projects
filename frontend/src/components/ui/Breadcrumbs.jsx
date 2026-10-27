import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/** items: [{ label, to? }] — the last item renders as plain text. */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <Link to="/">خانه</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <ChevronLeft size={13} className="breadcrumbs__sep" aria-hidden="true" />
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
