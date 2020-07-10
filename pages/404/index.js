import React from 'react';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

const props = {
  title: 'Page Not Found',
  description: 'You may have mistyped the address or the page may have moved.',
  showCookies: false,
};

const NotFoundPage = () => (
  <Layout {...props} title="Page Not Found | Global Forest Watch" noIndex>
    <div className="l-404-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <ConfirmationMessage {...props} error large />
        </div>
      </div>
    </div>
  </Layout>
);

export default NotFoundPage;
