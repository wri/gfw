import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import HeaderComponent from './header-component';
import actions from './header-actions';

import {
  getTotalCover,
  getTotalIntactForest
} from '../../../../services/tree-cover';

import {
  getTreeLossByYear
} from '../../../../services/tree-loss';

export { initialState } from './header-reducers';
export { default as reducers } from './header-reducers';
export { default as actions } from './header-actions';

const mapStateToProps = state => ({
  iso: state.root.iso,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  countryRegion: state.root.countryRegion,
  totalCoverHeader: state.header.totalCoverHeader,
  totalForestHeader: state.header.totalForestHeader,
  percentageForestHeader: state.header.percentageForestHeader,
  totalCoverLoss: state.header.totalCoverLoss
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
    props.setInitialState();
  };

  const setInitialData = () => {
    getTotalCover(props.iso, props.countryRegion, 30)
      .then((totalCoverResponse) => {
        getTreeLossByYear(
          props.iso,
          props.countryRegion,
          { minYear: 2015, maxYear: 2015 },
          30)
          .then((coverLoss) => {
            const totalCover = Math.round(totalCoverResponse.data.data[0].value);
            const values = {
              totalCoverHeader: props.countryRegion === 0 ? props.countryData.area_ha : props.countryRegions[props.countryRegion - 1].area_ha,
              totalForestHeader: totalCover,
              percentageForestHeader: props.countryRegion === 0 ? ((totalCover) / Math.round(props.countryData.area_ha)) * 100 : ((totalCover) / Math.round(props.countryRegions[props.countryRegion - 1].area_ha)) * 100,
              totalCoverLoss: coverLoss.data.data[0].value
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
