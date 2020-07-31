import { stringify } from 'query-string';

export const getServerSideProps = async ({ res, query }) => {
  const { widget, location, ...rest } = query || {};
  res.statusCode = 302;
  res.setHeader(
    'Location',
    `/embed/widget/${widget}/${location.join('/')}${
      rest ? `?${stringify(rest)}` : ''
    }`
  ); // Replace <link> with your url link

  return { props: {} };
};

const WidgetEmbedLegacyPage = () => {
  return null;
};

export default WidgetEmbedLegacyPage;
