import { connect } from 'react-redux';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import Component from './footer-component';

const mapStateToProps = ({ modalContactus }) => ({
  open: modalContactus && modalContactus.open
});

export default connect(mapStateToProps, { setModalContactUsOpen })(Component);
