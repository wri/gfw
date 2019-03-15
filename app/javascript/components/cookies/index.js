import { connect } from 'react-redux';
import Component from './component';

const mapStateToProps = ({ modalContactus, modalNewsletter }) => ({
  openContactUs:
    modalContactus && modalContactus.settings && modalContactus.settings.open,
  openNewsletter: modalNewsletter && modalNewsletter.open
});

export default connect(mapStateToProps)(Component);
