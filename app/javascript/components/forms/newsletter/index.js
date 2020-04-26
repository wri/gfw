import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ countryData, myGfw }) => ({
  countries: countryData?.countries,
  initialValues: {
    email: myGfw?.data?.email,
  },
});

export default connect(mapStateToProps)(Component);
