export const getServerSideProps = async ({ res }) => {
  res.statusCode = 302;
  res.setHeader('Location', 'https://www.globalforestwatch.org/howto');

  return { props: {} };
};

const WidgetEmbedLegacyPage = () => {
  return null;
};

export default WidgetEmbedLegacyPage;
