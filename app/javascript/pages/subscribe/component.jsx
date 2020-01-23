import React, { PureComponent } from 'react';

import NewsletterForm from 'components/forms/newsletter';

import './styles.scss';

class NewsletterPage extends PureComponent {
  render() {
    return (
      <div className="l-subscribe-page">
        <h1>{"Stay Updated on the World's Forests"}</h1>
        <h3>
          Subscribe to monthly GFW newsletters and updates based on your
          interests.
        </h3>
        <NewsletterForm />
      </div>
    );
  }
}

export default NewsletterPage;
