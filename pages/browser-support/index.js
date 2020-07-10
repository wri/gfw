import React from 'react';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

const props = {
  title: 'Browser Not Supported',
  description:
    'Oops, your browser isn’t supported. Please upgrade to a supported browser and try loading the website again.',
};

const BrowserPage = () => (
  <Layout
    {...props}
    title="Browser Not Supported | Global Forest Watch"
    showHeader={false}
    showFooter={false}
    showCookies={false}
    noIndex
  >
    <div className="l-browser-support-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <ConfirmationMessage {...props} error />
        </div>
      </div>
    </div>
  </Layout>
);

export default BrowserPage;
