import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-thank-you-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="thankyou-message">
              <h1>Thank you</h1>
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

// ThankyouPage.propTypes = {
// };

export default ThankyouPage;
