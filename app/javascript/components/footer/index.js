import { connect } from 'react-redux';
import { setModalContactUsOpen } from 'components/modals/contact-us/actions';
import Component from './component';

const mapStateToProps = ({ modalContactus }) => ({
  openContactUs:
    modalContactus && modalContactus.settings && modalContactus.settings.open
});

export default connect(mapStateToProps, {
  setModalContactUsOpen
})(Component);
