import { connect } from 'react-redux';

import Component from './component';
import { getCountriesFromIsos } from './selectors';

const mapStateToProps = ({ countryData }, { isos }) => ({
  countries: getCountriesFromIsos({ countries: countryData.countries, isos })
});

export default connect(mapStateToProps, null)(Component);
