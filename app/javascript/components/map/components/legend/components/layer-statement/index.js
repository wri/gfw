import { connect } from 'react-redux';

import Component from './component';

import config from './config';

const mapStateToProps = ({ countryData }, { type, isos }) => ({
  ...config[type],
  ...(!!isos && {
    tooltipDesc:
      countryData &&
      countryData.countries &&
      countryData.countries
        .filter(c => isos.includes(c.value))
        .map(c => c.label)
        .join(', ')
  })
});

export default connect(mapStateToProps, null)(Component);
