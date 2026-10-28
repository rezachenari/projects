import { Star } from 'lucide-react';

export default function Stars({ rating = 5, size = 14 }) {
  return (
    <span className="stars" aria-label={`${rating} از ۵`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.6}
          fill={index < rating ? 'currentColor' : 'none'}
          opacity={index < rating ? 1 : 0.35}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
