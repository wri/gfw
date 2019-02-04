import { connect } from 'react-redux';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import { setModalNewsletterOpen } from 'components/modals/newsletter/actions';
import Component from './footer-component';

const mapStateToProps = ({ modalContactus, modalNewsletter }) => ({
  openContactUs: modalContactus && modalContactus.open,
  openNewsletter: modalNewsletter && modalNewsletter.open
});

export default connect(mapStateToProps, {
  setModalContactUsOpen,
  setModalNewsletterOpen
})(Component);
