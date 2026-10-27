import { useCallback, useEffect, useState } from 'react';
import { getJSON } from './api';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFaDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function priceLabel(product) {
  if (!product) return '';
  if (product.price_label) return product.price_label;
  return 'استعلام قیمت';
}

export function useApi(path, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    getJSON(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, nonce, ...deps]);

  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, retry };
}

export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
