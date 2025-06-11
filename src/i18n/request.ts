import { getRequestConfig } from 'next-intl/server';

// @ts-expect-error - headers is present at runtime but not typed yet
export default getRequestConfig(async ({ headers }) => {
const cookie = (headers && typeof headers.get === 'function' ? headers.get('cookie') : '') || '';  const match = cookie.match(/locale=([a-zA-Z-]+)/);
  const locale = match ? match[1] : 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});