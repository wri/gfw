import React, { PureComponent } from 'react';

import Icon from 'components/ui/icon';
import treeImage from 'assets/icons/error.svg';

import './styles.scss';

class ErrorPage extends PureComponent {
  render() {
    return (
      <div className="l-failed-import-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="error-message">
              <Icon icon={treeImage} className="error-tree" />
              <h1>{'Sorry, something went wrong.'}</h1>
              <p>{'Try refreshing the page or check your connection.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
