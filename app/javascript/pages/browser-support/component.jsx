import React, { PureComponent } from 'react';

import Icon from 'components/ui/icon';
import treeImage from 'assets/icons/error.svg?sprite';

import './styles.scss';

class BrowserSupportPage extends PureComponent {
  render() {
    return (
      <div className="l-browser-support-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="browser-message">
              <Icon icon={treeImage} className="error-tree" />
              <h1>Browser Not Supported</h1>
              <p>
                Please upgrade to a supported browser and try loading the
                website again.
              </p>
              <p className="small">
                Currently supported browsers: Chrome 50, Firefox 48, Safari 10,
                Opera 51, IE 11, Edge 15.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BrowserSupportPage;
