import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ form, countryData }) => ({
  data: form && form.newsletter,
  countries:
    (countryData &&
      countryData.countries &&
      countryData.countries.map(c => ({ name: c.label, key: c.value }))) ||
    []
});

export default connect(mapStateToProps)(Component);
