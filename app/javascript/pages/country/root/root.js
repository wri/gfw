import { createElement } from 'react';
import { connect } from 'react-redux';

import {
  getCountryAdmin0,
  getCountryAdmin1,
  getCountryAdmin2
} from 'services/country';
import { getAdminGeostore } from 'services/geostore';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  isLoading: state.root.isLoading,
  admin0List: state.root.admin0List,
  admin1List: state.root.admin1List,
  admin2List: state.root.admin2List,
  geostore: state.root.geostore,
  gfwHeaderHeight: state.root.gfwHeaderHeight,
  isMapFixed: state.root.isMapFixed,
  mapTop: state.root.mapTop,
  topPage: state.root.topPage,
  showMapMobile: state.root.showMapMobile
});

const RootContainer = props => {
  const getLocationNames = (location, admin0List, admin1List, admin2List) => {
    const locationNames = {
      admin0: '',
      admin1: '',
      admin2: '',
      current: ''
    };
    admin0List.forEach(item => {
      if (item.iso === location.admin0) {
        locationNames.admin0 = item.name;
        locationNames.current = item.name;
      }
    });
    if (location.admin1) {
      locationNames.admin1 = admin1List[location.admin1 - 1].name;
      locationNames.current = admin1List[location.admin1 - 1].name;
    }
    if (location.admin2) {
      locationNames.admin2 = admin2List[location.admin2 - 1].name;
      locationNames.current = admin2List[location.admin2 - 1].name;
    }

    return locationNames;
  };

  const getBoxBounds = cornerBounds => [
    [cornerBounds[0], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[1]]
  ];

  const setInitialData = () => {
    const {
      location,
      setGeostore,
      setAdmin0List,
      setAdmin1List,
      setAdmin2List
    } = props;

    getAdminGeostore(location.admin0, location.admin1, location.admin2).then(
      response => {
        const { areaHa, bbox } = response.data.data.attributes;
        setGeostore({
          areaHa,
          bounds: getBoxBounds(bbox)
        });
      }
    );

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

  const checkLoadingStatus = newProps => {
    const { location, admin0List, admin1List, admin2List, geostore } = newProps;

    if (
      admin0List.length > 0 &&
      admin1List.length > 0 &&
      (!location.admin1 || (location.admin1 && admin2List.length > 0)) &&
      Object.keys(geostore).length > 0
    ) {
      setStatusComplete(newProps);
    }
  };

  const setStatusComplete = newProps => {
    const {
      location,
      admin0List,
      admin1List,
      admin2List,
      setIsLoading,
      setLocationNames
    } = newProps;

    setIsLoading(false);
    setLocationNames(
      getLocationNames(location, admin0List, admin1List, admin2List)
    );
  };

  return createElement(RootComponent, {
    ...props,
    setInitialData,
    checkLoadingStatus
  });
};

export default connect(mapStateToProps, actions)(RootContainer);
