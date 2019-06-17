import React, { PureComponent } from 'react';

import treeImage from './assets/tree.png';

import './styles.scss';

const supportedBrowsers = [
  {
    label: 'Chrome',
    version: 50,
    source: 'https://www.google.com/intl/en/chrome/browser'
  },
  {
    label: 'Firefox',
    version: 48,
    source: 'https://www.mozilla.org/en-US/firefox/all'
  },
  {
    label: 'Safari',
    version: 10,
    source: 'https://www.apple.com/safari'
  }
];

class BrowserSupportPage extends PureComponent {
  render() {
    return (
      <div className="l-browser-support-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="browser-message">
              <img src={treeImage} alt="thank-you-tree" />
              <h1>Page Not Found</h1>
              <p>
                You may have mistyped the address or the page may have moved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BrowserSupportPage;
