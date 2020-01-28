import React, { PureComponent } from 'react';

import NewsletterForm from 'components/forms/newsletter';

import './styles.scss';

class NewsletterPage extends PureComponent {
  render() {
    return (
      <div className="l-subscribe-page">
        <div className="row">
          <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
            <NewsletterForm />
          </div>
        </div>
      </div>
    );
  }
}

export default NewsletterPage;
