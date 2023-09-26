import apiFetch from '@wordpress/api-fetch';
import axios from 'axios';

const mapResponseToNotification = ({
  id,
  date,
  status,
  title,
  content,
  acf,
}) => {
  return {
    id,
    dateCreated: date,
    status,
    title: title.rendered,
    content: content.rendered,
    icon: acf.notification_icon,
    date: acf.notification_date,
  };
};

apiFetch.setFetchHandler(async (options) => {
  const headers = { 'Content-Type': 'application/json' };
  const { url, path, data, method, params } = options;

  return axios({
    headers,
    url: url || path,
    method,
    data,
    params,
  });
});

export const getPublishedNotifications = async ({ cancelToken }) => {
  try {
    const notificationsData = await apiFetch({
      url: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp/v2/notice?per_page=100&page=1&orderby=date&order=desc`,
      params: {
        _embed: true,
      },
      cancelToken,
    });

    return notificationsData?.data.map((item) =>
      mapResponseToNotification(item)
    );
  } catch (e) {
    return null;
  }
};
