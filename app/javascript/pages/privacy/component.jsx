import React, { PureComponent } from 'react';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-terms-page">
        <div className="row">
          <div className="column small-12 medium-10 medium-offset-1">
            <iframe
              title="privacy policy"
              src="https://www.wri.org/upload/privacy-policy.html"
              frameBorder="0"
              allowFullscreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ThankyouPage;
