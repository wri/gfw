import ErrorMessage from 'components/error-message';

import './styles.scss';

const BrowserSupportPage = () => (
  <div className="l-browser-support-page">
    <ErrorMessage
      title="Browser Not Supported"
      description="<p>Oops, your browser isn’t supported.</p><p>For the most secure and best experience, we recommend <a href='https://www.google.com/chrome/'>Chrome</a> or <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>.</p>"
      error
    />
  </div>
);

export default BrowserSupportPage;
