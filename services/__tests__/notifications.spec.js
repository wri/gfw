import axios from 'axios';
import { getPublishedNotifications } from '../notifications';
import { NOTIFICATIONS_RESPONSE } from '../../fixtures/notifications';

// eslint-disable-next-line no-undef
jest.mock('axios');

describe('getPublishedNotifications', () => {
  describe('when API call is successful', () => {
    it('should return a list of notifications', async () => {
      const response = NOTIFICATIONS_RESPONSE;
      const expectedResult = [
        {
          id: 16320,
          dateCreated: '2023-09-05T22:44:03',
          status: 'publish',
          title: 'GLAD-L Alerts Outage',
          content:
            '\n<p>Due to a a malfunction in the data processing pipeline for GLAD-L deforestation alerting system, new alerts will be unavailable until further notice.</p>\n',
          icon: 'warning',
          date: '2023-09-30',
        },
        {
          id: 16301,
          dateCreated: '2023-09-05T10:48:52',
          status: 'publish',
          title: 'Upcoming Webinar: Net Change in Tree Cover',
          content:
            '\n<p>Learn about the new net change in tree cover layer from WRI’s research team. After the presentation, participants will have the chance to ask questions. <a href="http://google.com">Sign up for the webinar here</a>.</p>\n',
          icon: 'layers',
          date: '2023-09-07',
        },
      ];

      axios.get.mockResolvedValueOnce(response);

      const result = await getPublishedNotifications();

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp/v2/notice?per_page=100&page=1&orderby=date&order=desc`
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('when API call fails', () => {
    it('should return null', async () => {
      const message = 'Network Error';

      axios.get.mockRejectedValueOnce(new Error(message));

      const result = await getPublishedNotifications();

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp/v2/notice?per_page=100&page=1&orderby=date&order=desc`
      );
      expect(result).toBe(null);
    });
  });
});
