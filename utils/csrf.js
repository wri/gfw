import { nextCsrf } from 'next-csrf';

const { csrf, setup } = nextCsrf({
  secret: process.env.CSRF_SECRET,
  ignoredMethods: ['HEAD', 'OPTIONS'],
  csrfErrorMessage: 'Unauthorized',
});

export { csrf };
export { setup as setupCsrf };
