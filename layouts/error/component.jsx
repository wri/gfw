import PropTypes from 'prop-types';

import Header from 'components/header';
import ContactUsModal from 'components/modals/contact-us';
import ErrorMessage from 'components/error-message';

import './styles.scss';

const ErrorPage = ({ title, description }) => (
  <>
    <Header />
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
