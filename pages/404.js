import ErrorLayout from 'layouts/error';
import Page404 from 'components/pages/404';

const Custom404 = () => (
  <ErrorLayout
    title="Page Not Found | Global Forest Watch"
    description="You may have mistyped the address or the page may have moved."
    noIndex
  >
    <Page404 />
  </ErrorLayout>
);

export default Custom404;
