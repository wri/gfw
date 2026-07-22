import { register, resetPassword } from 'services/user';
import { apiRequest } from 'utils/request';

jest.mock('utils/request', () => ({
  apiRequest: {
    post: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  },
  apiAuthRequest: { defaults: { headers: {} } },
}));

describe('user service', () => {
  const originalLocation = window.location;

  const setHost = (origin) => {
    delete window.location;
    window.location = { origin, host: origin.replace(/^https?:\/\//, '') };
  };

  afterEach(() => {
    window.location = originalLocation;
    jest.clearAllMocks();
  });

  describe('register user', () => {
    it('uses the current browser origin for callbackUrl', () => {
      setHost('https://www.globalnaturewatch.org');
      register({ email: 'user@example.com' });

      const url = apiRequest.post.mock.calls[0][0];
      expect(url).toContain(
        `callbackUrl=${encodeURIComponent(
          'https://www.globalnaturewatch.org/my-gnw/'
        )}`
      );
    });

    it('URL-encodes the callbackUrl so IPv6 loopback origins survive the query string', () => {
      setHost('http://[::1]:3000');
      register({ email: 'user@example.com' });

      const url = apiRequest.post.mock.calls[0][0];

      expect(url).not.toMatch(/[[\]]/);
      expect(url).toContain(
        `callbackUrl=${encodeURIComponent('http://[::1]:3000/my-gnw/')}`
      );
    });
  });

  describe('reset user password', () => {
    it('uses the current browser origin for callbackUrl', () => {
      setHost('https://staging.globalforestwatch.org');
      resetPassword({ email: 'user@example.com' });

      const url = apiRequest.post.mock.calls[0][0];
      expect(url).toContain(
        `callbackUrl=${encodeURIComponent(
          'https://staging.globalforestwatch.org/my-gnw/'
        )}`
      );
    });
  });
});
