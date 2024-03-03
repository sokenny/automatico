import { cookies } from 'next/headers';

async function ma8Fetch(url, options = {}) {
  const cookiesStore = cookies();
  const nextAuth = cookiesStore.get('next-auth.session-token');
  const defaultOptions = {
    headers: {
      cookie: nextAuth.value,
      Authorization: `Bearer ${nextAuth.value}`,
    },
    cache: 'no-store',
    ...options,
  };
  const response = await fetch(url, defaultOptions);
  return response;
}

export default ma8Fetch;
