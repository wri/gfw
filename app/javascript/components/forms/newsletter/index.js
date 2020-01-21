import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';

const mapStateToProps = ({ countryData, myGfw }) => ({
  countries: countryData && countryData.countries,
  initialValues: {
    email: myGfw && myGfw.data && myGfw.data.email
  }
});

export default connect(mapStateToProps, actions)(Component);
