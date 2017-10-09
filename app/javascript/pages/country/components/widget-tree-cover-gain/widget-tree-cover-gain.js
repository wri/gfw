import { createElement } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const mapStateToProps = state => ({
  isLoading: state.widgetTreeCoverGain.isLoading,
  iso: state.root.iso,
  countriesList: state.root.countriesList,
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  totalAmount: state.widgetTreeCoverGain.totalAmount,
  percentage: state.widgetTreeCoverGain.percentage,
  settings: state.widgetTreeCoverGain.settings,
  regions: state.widgetTreeCoverGain.regions,
  startYear: 2000,
  endYear: 2012,
  thresh: 30
});

import {
  getTreeCoverGain,
  getTotalCountriesTreeCoverGain
} from '../../../../services/tree-gain';

const WidgetTreeCoverGainContainer = (props) => {
  getTreeCoverGain(props.iso,{minYear: props.startYear, maxYear: props.endYear}, props.thresh)
  .then((coverGain) => {
    getTotalCountriesTreeCoverGain({minYear: props.startYear, maxYear: props.endYear}, props.thresh)
    .then((totalCoverGain) => {
      const values = {
        totalAmount: coverGain.data.data[0].value,
        percentage: (coverGain.data.data[0].value / totalCoverGain.data.data[0].value) * 100
      };
      props.setTreeCoverGainValues(values);
    });
  });
  return createElement(WidgetTreeCoverGainComponent, {
    ...props
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer));
