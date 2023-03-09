import PropTypes from 'prop-types';
import { Footer as FooterComponent } from 'gfw-components';

// import './styles.scss';

const Footer = ({ setModalContactUsOpen }) => {
  return (
    <FooterComponent
      className="c-footer"
      openContactUsModal={() => setModalContactUsOpen(true)}
    />
  );
};

Footer.propTypes = {
  setModalContactUsOpen: PropTypes.func,
};

export default Footer;
