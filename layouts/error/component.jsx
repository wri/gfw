import PropTypes from 'prop-types';

import SiteHeader from 'components/site-header';
import ContactUsModal from 'components/modals/contact-us';
import ErrorMessage from 'components/error-message';

const ErrorPage = ({ title, description }) => (
  <>
    <SiteHeader />
    <div className="l-error-page">
      <ErrorMessage title={title} description={description} error />
    </div>
    <ContactUsModal />
  </>
);

ErrorPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default ErrorPage;
