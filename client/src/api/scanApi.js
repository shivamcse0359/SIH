import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export async function scanUrl(url) {
  try {
    const { data } = await api.post('/scan', { url });
    return { data, error: null };
  } catch (err) {
    const message =
      err.response?.data?.error ||
      (err.code === 'ECONNABORTED'
        ? 'The scan took too long to respond. Please try again.'
        : 'Service temporarily unavailable. Please try again shortly.');
    return { data: null, error: message };
  }
}

export async function fetchHistory() {
  try {
    const { data } = await api.get('/history');
    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Could not load scan history.' };
  }
}
