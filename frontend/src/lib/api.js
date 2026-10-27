const BASE = '/api';

export async function getJSON(path) {
  const res = await fetch(BASE + path, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const message = res.status === 404 ? 'موردی با این مشخصات پیدا نشد.' : 'ارتباط با سرور برقرار نشد.';
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function postJSON(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || 'ارسال درخواست انجام نشد.');
    error.status = res.status;
    error.fields = data.fields || null;
    throw error;
  }
  return data;
}
