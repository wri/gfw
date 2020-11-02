import { stringify } from 'query-string';

// redirection for old widget embed routes
export const getServerSideProps = async ({ res, query }) => {
  const { widget, location, ...rest } = query || {};
  res.statusCode = 302;
  res.setHeader(
    'Location',
    `/embed/widget/${widget}/${location.join('/')}${
      rest ? `?${stringify(rest)}` : ''
    }`
  );

  return { props: {} };
};

const WidgetEmbedLegacyPage = () => {
  return null;
};

export default WidgetEmbedLegacyPage;
