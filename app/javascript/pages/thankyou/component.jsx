import React, { PureComponent } from 'react';

import treeImage from './assets/tree.png';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-thank-you-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="thankyou-message">
              <img src={treeImage} alt="thank-you-tree" />
              <h1>Thank You!</h1>
              <p>
                Thank you for letting us know you still want to hear from Global
                Forest Watch.
              </p>
              <p>
                You may wish to read our{' '}
                <a href="/privacy-policy">privacy policy</a>, which provides
                further information about how we use personal data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankyouPage;
