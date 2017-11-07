import { createElement } from 'react';
import { connect } from 'react-redux';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

import {
  getCountriesList,
  getCountry,
  getCountryRegions
} from '../../../../services/country';

const mapStateToProps = state => ({
  isLoading: state.root.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  countriesList: state.root.countriesList,
  fixed: state.root.fixed,
  topMap: state.root.topMap,
  topPage: state.root.topPage,
  nameRegion: state.root.nameRegion,
  showMapMobile: state.root.showMapMobile
});

const RootContainer = (props) => {

  const refreshCountryData = () => {
    props.setIso(props.match.params.iso);
    props.setRegion(props.match.params.region ? props.match.params.region : 0);

    getCountry(props.match.params.iso)
      .then((getCountryResponse) => {
        getCountryResponse.data['area_ha'] = getCountryResponse.data.umd[0].area_ha;

        getCountryRegions(props.match.params.iso)
          .then((getCountryRegionsResponse) => {
            props.setCountryData({
              data: getCountryResponse.data,
              regions: getCountryRegionsResponse.data.data
            });
          });
      });
  };

  const setInitialData = (props) => {
    getCountriesList()
      .then((response) => {
        props.setCountriesList(response.data.data);
      });
    refreshCountryData(props);
  };

  return createElement(RootComponent, {
    ...props,
    setInitialData,
    refreshCountryData
  });
};

export default connect(mapStateToProps, actions)(RootContainer);
