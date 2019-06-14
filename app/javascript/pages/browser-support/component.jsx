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
              <h1>Browser Not Supported</h1>
              <p>
                This website is optimized for these browsers. Please upgrade to a supported browser and try loading the website again.
              </p>
            </div>
            {/* <section class="header-static">
              <div class="inner">
                <header>
                  <h3>This website is optimized for these browsers. Please upgrade to a supported browser and try loading the website again.</h3>
                </header>
                <ul class="row row3">
                  <li><a href="https://www.google.com/intl/en/chrome/browser/" class="btn white uppercase">Chrome 50</a></li>
                  <li><a href="https://www.mozilla.org/en-US/firefox/all/" class="btn white uppercase">Firefox 48</a></li>
                  <li><a href="https://www.apple.com/safari" class="btn white uppercase">Safari 10</a></li>
                  <li><a href="https://www.opera.com/" class="btn white uppercase">Opera 51</a></li>
                  <li><a href="https://windows.microsoft.com/en-us/internet-explorer/ie-11-worldwide-languages" class="btn white uppercase">Internet Explorer 11</a></li>
                  <li><a href="https://microsoft-edge.en.softonic.com" class="btn white uppercase">Edge 15</a></li>
                </ul>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    );
  }
}

export default BrowserSupportPage;
