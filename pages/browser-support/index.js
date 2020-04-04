import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

class BrowserPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  };

  render() {
    const { title, description } = this.props;

    return (
      <Layout {...this.props}>
        <div className="l-browser-support-page">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <ConfirmationMessage
                title={title}
                description={description}
                error
              />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BrowserPage;
