import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ countryData }) => ({
  countries: countryData && countryData.countries
});

export default connect(mapStateToProps)(Component);
