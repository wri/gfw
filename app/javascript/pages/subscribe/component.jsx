import React, { PureComponent } from 'react';

import NewsletterForm from 'components/forms/newsletter';

import './styles.scss';

class NewsletterPage extends PureComponent {
  render() {
    return (
      <div className="l-subscribe-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="subscribe-header">
              <h1>{"Stay Updated on the World's Forests"}</h1>
              <h3>
                Subscribe to monthly GFW newsletters and updates based on your
                interests.
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="suscribe-form column small-12 medium-6 medium-offset-3">
            <NewsletterForm />
          </div>
        </div>
      </div>
    );
  }
}

export default NewsletterPage;
