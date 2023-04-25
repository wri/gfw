import React, { PureComponent } from 'react';

import { Row, Column } from '@worldresources/gfw-components';

import NewsletterForm from 'components/forms/newsletter';

class NewsletterPage extends PureComponent {
  render() {
    return (
      <div className="l-subscribe-page">
        <Row>
          <Column>
            <NewsletterForm />
          </Column>
        </Row>
      </div>
    );
  }
}

export default NewsletterPage;
