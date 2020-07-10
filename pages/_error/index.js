import React from 'react';
import PropTypes from 'prop-types';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';

import './styles.scss';

const Error = ({ statusCode }) => (
  <Layout
    title={
      `An error ${statusCode} occurred` ||
      "We're sorry, something went wrong | Global Forest Watch"
    }
    description="Try refreshing the page or check your connection."
    noIndex
  >
    <div className="l-error-page">
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <ConfirmationMessage
            title={
              `An error ${statusCode} occurred` ||
              "We're sorry, something went wrong."
            }
            description="Try refreshing the page or check your connection."
            error
          />
        </div>
      </div>
    </div>
  </Layout>
);

export const getServerSideProps = ({ res, err }) => ({
  props: {
    statusCode: (res && res.statusCode) || (err && err.statusCode) || 404,
  },
});

Error.propTypes = {
  statusCode: PropTypes.number,
};

export default Error;
