import React, { PureComponent } from 'react';

import { NavLink } from 'redux-first-router-link';
import treeImage from 'assets/icons/tree-success.png';

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
                Thank you for subscribing to Global Forest Watch newsletters and
                updates.
              </p>
              <p>
                You may wish to read our{' '}
                <NavLink to="/privacy-policy">privacy policy</NavLink>, which
                provides further information about how we use personal data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankyouPage;
