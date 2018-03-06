import { connect } from 'react-redux';

import Component from './dropdown-component';

const mapStateToProps = ({ modalMeta }) => ({
  modalOpen: modalMeta.open,
  modalClosing: modalMeta.closing
});

export default connect(mapStateToProps, null)(Component);
