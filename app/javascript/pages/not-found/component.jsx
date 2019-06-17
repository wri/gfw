import React, { PureComponent } from 'react';

import Icon from 'components/ui/icon';
import treeImage from 'assets/icons/error.svg';

import './styles.scss';

class BrowserSupportPage extends PureComponent {
  render() {
    return (
      <div className="l-not-found-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="not-found-message">
              <Icon icon={treeImage} className="error-tree" />
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
