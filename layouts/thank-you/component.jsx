import React, { PureComponent } from 'react';

import { Row, Column } from '@worldresources/gfw-components';

import SuccessMessage from 'components/success-message';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-thank-you-page">
        <Row>
          <Column>
            <SuccessMessage
              title="Thank you!"
              description="<p>Thank you for subscribing to Global Forest Watch newsletters and updates.</p><p>You may wish to read our <a href='/privacy-policy'>privacy policy</a>, which provides further information about how we use personal data.</p>"
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default ThankyouPage;
