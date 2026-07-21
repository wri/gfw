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
        'callbackUrl=https://www.globalnaturewatch.org/my-gfw/'
      );
    });
  });

  describe('reset user password', () => {
    it('uses the current browser origin for callbackUrl', () => {
      setHost('https://staging.globalforestwatch.org');
      resetPassword({ email: 'user@example.com' });

      const url = apiRequest.post.mock.calls[0][0];
      expect(url).toContain(
        'callbackUrl=https://staging.globalforestwatch.org/my-gfw/'
      );
    });
  });
});
