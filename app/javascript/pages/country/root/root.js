import { createElement } from 'react';
import { connect } from 'react-redux';

import {
  getCountryAdmin0,
  getCountryAdmin1,
  getCountryAdmin2
} from 'services/country';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  isLoading: state.root.isLoading,
  admin0: state.root.admin0,
  admin1: state.root.admin1,
  admin2: state.root.admin2,
  gfwHeaderHeight: state.root.gfwHeaderHeight,
  isMapFixed: state.root.isMapFixed,
  mapTop: state.root.mapTop,
  topPage: state.root.topPage,
  showMapMobile: state.root.showMapMobile
});

const RootContainer = props => {
  const refreshCountryData = newProps => {
    const { location, setLocation, setAdmin0List, setAdmin1List, setAdmin2List, setCountryData } = newProps;

    

    getCountriesList().then(getCountriesListResponse => {
      getCountry(location.iso).then(getCountryResponse => {
        const getCountryData = getCountryResponse.data;
        getCountryData.area_ha = getCountryResponse.data.umd[0].area_ha;

        getCountryAdmin1(location.iso).then(getCountryAdmin1Response => {
          if (location.admin1) {
            getCountryAdmin2(location.iso, location.admin1).then(getCountryAdmin2Response => {
              setCountryData({
                data: getCountryData,
                admin1Data: getCountryAdmin1Response.data.data,
                admin2Data: getCountryAdmin2Response.data.data,
                countries: getCountriesListResponse.data.data
              });
              setLocationName(
                location,
                getCountryData,
                getCountryAdmin1Response.data.data,
                getCountryAdmin2Response.data.data
              );
            });
          } else {
            setCountryData({
              data: getCountryData,
              admin1Data: getCountryAdmin1Response.data.data,
              admin2Data: [],
              countries: getCountriesListResponse.data.data
            });
            setLocationName(
              location,
              getCountryData,
              getCountryAdmin1Response.data.data
            );
          }
        });
      });
    });
  };

  const updateLocationName = (location, admin0Data, admin1Data, admin2Data) => {
    const { setLocationName } = props;

    if (location.admin2) {
      setLocationName(admin2Data[location.admin2 - 1].name);
    } else if (location.admin1) {
      setLocationName(admin1Data[location.admin1 - 1].name);
    } else {
      setLocationName(admin0Data[location.admin1 - 1].name);
    }
  };

  const setInitialData = () => {
    const { location, setLocation, setAdmin0List, setAdmin1List, setAdmin2List } = props;

    setLocation({
      admin0: location.admin0,
      admin1: location.admin1,
      admin2: location.admin2
    });

    getCountryAdmin0().then(response => {
      setAdmin0List(response.data.rows);
    });

    getCountryAdmin1(location.admin0).then(response => {
      setAdmin1List(response.data.rows);
    });

    if (location.admin1) {
      getCountryAdmin2(location.admin0, location.admin1).then(response => {
        setAdmin2List(response.data.rows);
      });
    }
  };

  const checkLoadingStatus = (newProps) => {
    if ()
  };

  const setStatusComplete = () => {
    
  };

  return createElement(RootComponent, {
    ...props,
    setInitialData,
    checkLoadingStatus
  });
};

export default connect(mapStateToProps, actions)(RootContainer);
