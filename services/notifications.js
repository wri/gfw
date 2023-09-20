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

export const getPublishedNotifications = async () => {
  try {
    const notificationsData = await axios.get(
      `${
        process.env.NEXT_PUBLIC_WORDPRESS_URL
      }/wp/v2/notice?per_page=100&page=1&orderby=date&order=desc&timestamp=${new Date().getTime()}`
    );

    return notificationsData?.data.map((item) =>
      mapResponseToNotification(item)
    );
  } catch (e) {
    return null;
  }
};
