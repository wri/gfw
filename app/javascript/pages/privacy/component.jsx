import React, { PureComponent } from 'react';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-privacy-page">
        <div className="row">
          <div className="column small-12 medium-10 medium-offset-1">
            <div className="privacy-container">
              <iframe
                src="https://www.wri.org/upload/privacy-policy.html"
                style={{
                  overflow: 'hidden',
                  height: '100%',
                  width: '100%',
                }}
                width="100%"
                height="100%"
                title="privacy-policy"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankyouPage;
