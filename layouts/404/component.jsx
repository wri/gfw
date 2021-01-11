import ErrorMessage from 'components/error-message';
import Header from 'components/header';
import ContactUsModal from 'components/modals/contact-us';

import './styles.scss';

const NotFoundPage = () => (
  <>
    <Header />
    <div className="l-404-page">
      <ErrorMessage
        title="Page Not Found"
        description="You may have mistyped the address or the page may have moved."
        error
      />
    </div>
    <ContactUsModal />
  </>
);

export default NotFoundPage;
