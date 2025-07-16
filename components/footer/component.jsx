import PropTypes from 'prop-types';
import { Footer as FooterComponent } from '@worldresources/gfw-components';

const isOsanoEnabled = process.env.NEXT_PUBLIC_OSANO_ENABLED === 'true';

const Footer = ({ setModalContactUsOpen }) => {
  const handleOsanoCookiePreferences = (e) => {
    e.preventDefault();

    if (isOsanoEnabled) {
      // eslint-disable-next-line no-undef
      Osano.cm.showDrawer('osano-cm-dom-info-dialog-open');

      const { length } = document.getElementsByClassName(
        'osano-cm-view__list osano-cm-list'
      )[0].children;

      if (length > 4) {
        // remove "Do not sell"
        document.getElementsByClassName(
          'osano-cm-view__list osano-cm-list'
        )[0].children[length - 1].style.display = 'none';
      }
    }
  };

  return (
    <FooterComponent
      className="c-footer"
      showCookiePreferencesLink={isOsanoEnabled}
      handleCookiePreferencesClick={handleOsanoCookiePreferences}
      openContactUsModal={() => setModalContactUsOpen(true)}
    />
  );
};

Footer.propTypes = {
  setModalContactUsOpen: PropTypes.func,
};

export default Footer;
