import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ myGfw }) => ({
  initialValues: {
    email: myGfw?.data?.email,
  },
});

export default connect(mapStateToProps)(Component);
