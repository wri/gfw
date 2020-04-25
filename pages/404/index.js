import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'layouts/page';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

const NotFoundPage = (props) => (
  <Layout {...props}>
    <div className="l-404-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <ConfirmationMessage
            title={props.title}
            description={props.description}
            error
            large
          />
        </div>
      </div>
    </div>
  </Layout>
);

NotFoundPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default NotFoundPage;
