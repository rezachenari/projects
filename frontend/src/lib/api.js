const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function fetchJSON(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...JSON_HEADERS, ...(options.headers || {}) },
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'درخواست ناموفق بود.');
    error.fields = payload?.fields || null;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export const getSettings = () => fetchJSON('/api/settings').then((data) => data.settings || {});
export const getMenu = () => fetchJSON('/api/menu').then((data) => data.categories || []);
export const getTestimonials = () => fetchJSON('/api/testimonials').then((data) => data.testimonials || []);

export const createReservation = (payload) =>
  fetchJSON('/api/reservations', { method: 'POST', body: JSON.stringify(payload) });
