import PropTypes from 'prop-types';

import ErrorLayout from 'layouts/error';
import ErrorPage from 'components/pages/error';

const Error = ({ statusCode }) => {
  const title =
    `An error ${statusCode ? `${statusCode} ` : ''}occurred` ||
    "We're sorry, something went wrong | Global Forest Watch";
  const description = 'Try refreshing the page or check your connection.';

  return (
    <ErrorLayout title={title} description={description} noIndex>
      <ErrorPage title={title} description={description} />
    </ErrorLayout>
  );
};

Error.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

Error.propTypes = {
  statusCode: PropTypes.number,
};

export default Error;
