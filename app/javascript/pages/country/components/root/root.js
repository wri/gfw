import { createElement } from 'react';
import { connect } from 'react-redux';

import RootComponent from './root-component';
import actions from './root-actions';

import {
  getCountriesList,
  getCountry,
  getCountryRegions
} from '../../../../services/country';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  isLoading: state.root.isLoading,
  iso: state.root.iso,
  countryRegion: state.root.countryRegion,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  countriesList: state.root.countriesList,
  gfwHeaderHeight: state.root.gfwHeaderHeight,
  isMapFixed: state.root.isMapFixed,
  mapTop: state.root.mapTop,
  topPage: state.root.topPage,
  nameRegion: state.root.nameRegion,
  showMapMobile: state.root.showMapMobile
});

const RootContainer = props => {
  const refreshCountryData = () => {
    props.setIso(props.location.iso);
    props.setRegion(props.location.region ? props.location.region : 0);

    getCountry(props.location.iso).then(getCountryResponse => {
      const getCountryData = getCountryResponse.data;
      getCountryData.area_ha = getCountryResponse.data.umd[0].area_ha;

      getCountryRegions(props.location.iso).then(getCountryRegionsResponse => {
        props.setCountryData({
          data: getCountryData,
          regions: getCountryRegionsResponse.data.data
        });
      });
    });
  };

  const setInitialData = newProps => {
    getCountriesList().then(response => {
      newProps.setCountriesList(response.data.data);
    });
    refreshCountryData(newProps);
  };

  return createElement(RootComponent, {
    ...props,
    setInitialData,
    refreshCountryData
  });
};

export default connect(mapStateToProps, actions)(RootContainer);
