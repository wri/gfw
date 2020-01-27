import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ form }) => ({
  data: form && form.contact
});

export default connect(mapStateToProps)(Component);
