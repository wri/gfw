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
  const refreshCountryData = newProps => {
    const { location, setIso, setRegion, setCountryData } = newProps;

    setIso(location.iso);
    setRegion(location.region ? location.region : 0);

    getCountry(location.iso).then(getCountryResponse => {
      const getCountryData = getCountryResponse.data;
      getCountryData.area_ha = getCountryResponse.data.umd[0].area_ha;

      getCountryRegions(location.iso).then(getCountryRegionsResponse => {
        setCountryData({
          data: getCountryData,
          regions: getCountryRegionsResponse.data.data
        });
      });
    });
  };

  const setInitialData = () => {
    getCountriesList().then(response => {
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
