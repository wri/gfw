import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';
// import compact from 'lodash/compact';
// import intersection from 'lodash/intersection';

import { setMapSettings as setMapState } from 'components/map/actions';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import { setShareModal } from 'components/modals/share/share-actions';

// import * as ownActions from 'components/widgets/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';
import { getWidgetsProps } from './selectors';

// import { getWidgetDatasets, getPolynameDatasets } from './utils';

const actions = {
  ...ownActions,
  setMapSettings: setMapState,
  setModalMetaSettings,
  setShareModal
};

// const mapSyncKeys = [
//   'startYear',
//   'endYear',
//   'threshold',
//   'extentYear',
//   'forestType',
//   'landCategory'
// ];

// const adminBoundaryLayer = {
//   dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
//   layers: [
//     '6f6798e6-39ec-4163-979e-182a74ca65ee',
//     'c5d1e010-383a-4713-9aaa-44f728c0571c'
//   ],
//   opacity: 1,
//   visibility: true
// };

class WidgetsContainer extends PureComponent {
  componentDidMount() {
    const { getWidgetsData, location } = this.props;
    if (location.type === 'global') {
      getWidgetsData();
    }
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     active,
  //     location,
  //     settings,
  //     config,
  //     widget,
  //     error
  //   } = this.props;
  //   const { refetchKeys } = config || {};

  //   const hasLocationChanged = !isEqual(location, prevProps.location);
  //   const hasErrorChanged =
  //     !error &&
  //     prevProps.error !== undefined &&
  //     !isEqual(error, prevProps.error);
  //   let changedSetting = '';
  //   if (settings && prevProps.settings) {
  //     Object.keys(settings).forEach(s => {
  //       if (!isEqual(settings[s], prevProps.settings[s])) {
  //         changedSetting = s;
  //       }
  //     });
  //   }
  //   const hasSettingsChanged =
  //     settings &&
  //     prevProps.settings &&
  //     changedSetting &&
  //     !refetchKeys.includes(changedSetting);

  //   // refetch data if error, settings, or location changes
  //   if (hasSettingsChanged || hasLocationChanged || hasErrorChanged) {
  //     const params = { ...location, ...settings };
  //     this.handleGetWidgetData({ widget, params });
  //   }

  //   // if widget is active and layers or params change push to map
  //   if (active) {
  //     const { datasets } = config || {};
  //     const mapSettingsChanged =
  //       settings &&
  //       intersection(mapSyncKeys, Object.keys(settings)).length &&
  //       !isEqual(settings, prevProps.settings);
  //     const activeChanged = !isEqual(active && prevProps.active);
  //     if (datasets && (mapSettingsChanged || activeChanged)) {
  //       this.syncWidgetWithMap();
  //     } else if (!datasets && activeChanged) {
  //       this.clearMap();
  //     }
  //   }

  //   // if widget is no longer active remove layers from map
  //   if (!active && !isEqual(active, prevProps.active)) {
  //     this.clearMap();
  //   }
  // }

  // syncWidgetWithMap = () => {
  //   const { handleSyncMap, settings, config, polynames, options } = this.props;
  //   const { datasets } = config || {};

  //   const widgetDatasets =
  //     datasets &&
  //     datasets.length &&
  //     getWidgetDatasets({ datasets, ...settings });

  //   const polynameDatasets =
  //     polynames &&
  //     polynames.length &&
  //     getPolynameDatasets({ polynames, options, settings });

  //   const allDatasets = [...compact(polynameDatasets), ...widgetDatasets];

  //   handleSyncMap({
  //     datasets: allDatasets
  //   });
  // };

  // clearMap = () => {
  //   const { handleSyncMap } = this.props;
  //   handleSyncMap({
  //     datasets: [adminBoundaryLayer]
  //   });
  // };

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

WidgetsContainer.propTypes = {
  getWidgetsData: PropTypes.func
};

reducerRegistry.registerModule('widgets', {
  actions,
  reducers,
  initialState
});

export default connect(getWidgetsProps, actions)(WidgetsContainer);
