import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import HeaderComponent from './header-component';
import actions from './header-actions';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

import {
  getTotalCover,
  getTotalIntactForest
} from '../../../../services/tree-cover';

const mapStateToProps = state => ({
  iso: state.root.iso,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  countryRegion: state.root.countryRegion,
  totalCoverHeader: state.header.totalCoverHeader,
  totalForestHeader: state.header.totalForestHeader,
  percentageForestHeader: state.header.percentageForestHeader
});

const HeaderContainer = (props) => {
  const selectCountry = (iso) => {
    const { history } = props;

    history.push(`/country/${iso}`);
    props.setInitialState();
  };

  const selectRegion = (region) => {
    const { iso, history } = props;

    history.push(`/country/${iso}/${region}`);
  };

  const setInitialData = (props) => {
    getTotalCover(props.iso, props.countryRegion, 30)
      .then((totalCoverResponse) => {
        getTotalIntactForest(props.iso, props.countryRegion)
          .then((totalIntactForestResponse) => {
          const totalCover = Math.round(totalCoverResponse.data.data[0].value);
          const totalIntactForest = Math.round(totalIntactForestResponse.data.data[0].value);
          const values = {
            totalCoverHeader: props.countryData.area_ha,
            totalForestHeader: totalCover + totalIntactForest,
            percentageForestHeader: ((totalCover + totalIntactForest) / Math.round(props.countryData.area_ha)) * 100
          };
          props.setTreeCoverValuesHeader(values);
      });
    });
  };

  return createElement(HeaderComponent, {
    ...props,
    selectCountry,
    selectRegion,
    setInitialData,
  });
};

export default withRouter(connect(mapStateToProps, actions)(HeaderContainer));
