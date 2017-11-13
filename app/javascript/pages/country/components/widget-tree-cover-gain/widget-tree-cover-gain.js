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
  countryData: state.root.countryData,
  countryRegions: state.root.countryRegions,
  countryRegion: state.root.countryRegion,
  totalAmount: state.widgetTreeCoverGain.totalAmount,
  percentage: state.widgetTreeCoverGain.percentage,
  settings: state.widgetTreeCoverGain.settings,
  locations: state.widgetTreeCoverGain.locations
});

import {
  getTreeCoverGain,
  getTotalCountriesTreeCoverGain
} from '../../../../services/tree-gain';

const WidgetTreeCoverGainContainer = (props) => {
  const setInitialData = (props) => {
    setWidgetData(props);
  };

  const updateData = (props) => {
    props.setTreeCoverGainIsLoading(true);
    setWidgetData(props);
  };

  const setWidgetData = (props) => {
    getTreeCoverGain(props.iso,{ minYear: props.settings.startYear, maxYear: props.settings.endYear }, props.settings.canopy, props.countryRegion)
      .then((coverGain) => {
        getTotalCountriesTreeCoverGain({minYear: props.settings.startYear, maxYear: props.settings.endYear}, props.settings.canopy)
          .then((totalCoverGain) => {
            const values = {
              totalAmount: coverGain.data.data[0].value,
              percentage: (coverGain.data.data[0].value / totalCoverGain.data.data[0].value) * 100
            };
            props.setTreeCoverGainValues(values);
          });
      });
  };


  return createElement(WidgetTreeCoverGainComponent, {
    ...props,
    setInitialData,
    updateData
  });
};

export default withRouter(connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer));
