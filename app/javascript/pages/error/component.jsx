import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import treeImage from 'assets/icons/error.svg';

import './styles.scss';

class ErrorPage extends PureComponent {
  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    const { metadata } = this.props;
    return (
      <div className="l-error-page">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <div className="error-message">
              <Icon icon={treeImage} className="error-tree" />
              <h1>
                {(metadata && metadata.title) || 'Sorry, something went wrong.'}
              </h1>
              <p>
                {(metadata && metadata.desc) ||
                  'Try refreshing the page or check your connection.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
