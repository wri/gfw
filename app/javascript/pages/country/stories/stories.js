import { createElement } from 'react';
import { connect } from 'react-redux';
import { getAdminsSelected } from 'pages/country/widget/widget-selectors';

import StoriesComponent from './stories-component';
import actions from './stories-actions';

export { initialState } from './stories-reducers';
export { default as reducers } from './stories-reducers';
export { default as actions } from './stories-actions';

const mapStateToProps = state => {
  const adminData = {
    location: state.location.payload,
    countries: state.countryData.countries,
    regions: state.countryData.regions,
    subRegions: state.countryData.subRegions
  };
  return {
    totalAmount: 'Nan',
    percentage: 'Nan',
    startYear: 2011,
    endYear: 2014,
    locationNames: getAdminsSelected(adminData)
  };
};

const StoriesContainer = props =>
  createElement(StoriesComponent, {
    ...props
  });

export default connect(mapStateToProps, actions)(StoriesContainer);
