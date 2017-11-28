import { createElement } from 'react';
import { connect } from 'react-redux';

import HeaderComponent from './header-component';
import actions from './header-actions';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

const mapStateToProps = state => ({
  isRootLoading: state.root.isLoading,
  location: state.location.payload,
  admin0List: state.root.admin0List,
  admin1List: state.root.admin1List,
  admin2List: state.root.admin2List,
  selectedAdmin0: state.header.selectedAdmin0,
  selectedAdmin1: state.header.selectedAdmin1,
  selectedAdmin2: state.header.selectedAdmin2,
  admin0SelectData: state.header.admin0SelectData,
  admin1SelectData: state.header.admin1SelectData,
  admin2SelectData: state.header.admin2SelectData,

  selectedCountry: state.header.selectedCountry,
  selectedRegion: state.header.selectedRegion,
  countrySelectData: state.header.countrySelectData,
  regionSelectData: state.header.regionSelectData,
  totalCoverHeader: state.header.totalCoverHeader,
  totalForestHeader: state.header.totalForestHeader,
  percentageForestHeader: state.header.percentageForestHeader,
  totalCoverLoss: state.header.totalCoverLoss
});

const HeaderContainer = props => {
  const setInitialData = newProps => {
    const { setHeaderSelectValues } = newProps;

    setHeaderSelectValues(getSelectValues(newProps));
  };

  const getSelectValues = newProps => {
    const { location, admin0List, admin1List, admin2List } = newProps;

    const values = {
      selectedAdmin0: 'Select Country',
      selectedAdmin1: 'Select Region',
      selectedAdmin2: 'Select Region'
    };
    values.admin0SelectData = admin0List.map(item => {
      if (location.admin0 === item.iso) {
        values.selectedAdmin0 = item.name;
      }

      return {
        value: item.iso,
        label: item.name
      };
    });

    values.admin1SelectData = admin1List.map(item => {
      if (location.admin1 === item.id) {
        values.selectedAdmin1 = item.name;
      }

      return {
        value: item.id,
        label: item.name
      };
    });

    values.admin2SelectData = admin2List.map(item => {
      if (location.admin2 === item.id) {
        values.selectedAdmin2 = item.name;
      }

      return {
        value: item.id,
        label: item.name
      };
    });

    return values;
  };

  return createElement(HeaderComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(HeaderContainer);
