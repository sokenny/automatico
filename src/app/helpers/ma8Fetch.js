import { cookies } from 'next/headers';
import getAuthTokenName from './getAuthTokenName';

async function ma8Fetch(url, options = {}) {
  const cookiesStore = cookies();
  const nextAuth = cookiesStore.get(getAuthTokenName());
  const defaultOptions = {
    headers: {
      cookie: nextAuth.value,
      Authorization: `Bearer ${nextAuth.value}`,
    },
    cache: 'force-cache',
    ...options,
  };
  const response = await fetch(url, defaultOptions);
  return response;
}

export default ma8Fetch;
