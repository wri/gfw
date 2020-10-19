import ErrorMessage from 'components/error-message';

import './styles.scss';

const BrowserSupportPage = () => (
  <div className="l-browser-support-page">
    <ErrorMessage
      title="Browser Not Supported"
      description="<p>Oops, your browser isn’t supported. Please upgrade and try loading the website again.</p><p>Currently supported: Chrome 50, Firefox 48, Safari 10, Opera 51, Edge 15.</p>"
      error
    />
  </div>
);

export default BrowserSupportPage;
