import StaticWrapper from 'wrappers/static';
import Page404 from 'layouts/404';

const Custom404 = () => (
  <StaticWrapper
    title="Page Not Found | Global Forest Watch"
    description="You may have mistyped the address or the page may have moved."
    noIndex
  >
    <Page404 />
  </StaticWrapper>
);

export default Custom404;
