import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logEvent } from 'app/analytics';

import withTooltipEvt from 'components/ui/with-tooltip-evt';
import { setModalMetaSettings } from 'components/modals/meta/actions';
import * as mapActions from 'components/map/actions';

import { getBasemapsProps } from './selectors';
import BasemapsComponent from './component';

const actions = {
  setModalMetaSettings,
  ...mapActions
};

class BasemapsContainer extends React.Component {
  static propTypes = {
    activeLabels: PropTypes.object,
    basemaps: PropTypes.object,
    labels: PropTypes.array,
    activeDatasets: PropTypes.array,
    activeBoundaries: PropTypes.object,
    setMapSettings: PropTypes.func.isRequired
  };

  selectBasemap = basemap => {
    const { setMapSettings } = this.props;
    setMapSettings({ basemap });
    logEvent('basemapChanged', {
      label: basemap.value
    });
  };

  selectLabels = label => {
    this.props.setMapSettings({ labels: label.value === 'showLabels' });
    logEvent('labelChanged', {
      label: label.label
    });
  };

  selectRoads = roads => {
    this.props.setMapSettings({ roads: roads.value });
    logEvent('roadsChanged', {
      roads: roads.label
    });
  };

  selectBoundaries = item => {
    const { activeDatasets, activeBoundaries } = this.props;
    const filteredLayers = activeBoundaries
      ? activeDatasets.filter(l => l.dataset !== activeBoundaries.dataset)
      : activeDatasets;
    if (item.value !== 'no-boundaries') {
      const newActiveDatasets = [
        {
          layers: item.layers,
          dataset: item.dataset,
          opacity: 1,
          visibility: true
        },
        ...filteredLayers
      ];
      this.props.setMapSettings({ datasets: newActiveDatasets });
    } else {
      this.props.setMapSettings({ datasets: filteredLayers });
    }
    logEvent('boundaryChanged', {
      label: item.dataset
    });
  };

  render() {
    return (
      <BasemapsComponent
        {...this.props}
        selectBasemap={this.selectBasemap}
        selectLabels={this.selectLabels}
        selectBoundaries={this.selectBoundaries}
        selectRoads={this.selectRoads}
      />
    );
  }
}

export default withTooltipEvt(
  connect(getBasemapsProps, actions)(BasemapsContainer)
);
