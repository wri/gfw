import StaticWrapper from 'wrappers/static';
import BrowserSupportPage from 'layouts/browser-support';

const BrowserPage = () => (
  <StaticWrapper
    title="Browser Not Supported | Global Forest Watch"
    description="Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again."
    noIndex
  >
    <BrowserSupportPage />
  </StaticWrapper>
);

export default BrowserPage;
