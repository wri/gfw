import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'utils/analytics';

import withTooltipEvt from 'components/ui/with-tooltip-evt';

import * as actions from 'components/maps/map/actions';
import { getBasemapsProps } from './basemaps-selectors';
import BasemapsComponent from './basemaps-component';

class BasemapsContainer extends React.Component {
  static propTypes = {
    activeDatasets: PropTypes.array,
    activeBoundaries: PropTypes.object,
    setMapSettings: PropTypes.func.isRequired,
    setLandsatBasemap: PropTypes.func.isRequired
  };

  selectBasemap = (basemap, year) => {
    const label =
      this.props.labels[basemap.labelsKey] || this.props.activeLabels;
    if (basemap.dynamic) {
      if (basemap.id === 'landsat') {
        this.props.setLandsatBasemap({
          year,
          defaultUrl: basemap.defaultUrl
        });
      }
    } else {
      this.props.setMapSettings({ basemap });
    }
    this.props.setMapSettings({ label });
    track('basemapChanged', {
      label: basemap.label
    });
  };

  selectLabels = label => {
    this.props.setMapSettings({ label });
    track('labelChanged', {
      label: label.label
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
    track('boundaryChanged', {
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
      />
    );
  }
}

BasemapsContainer.propTypes = {
  activeLabels: PropTypes.object,
  labels: PropTypes.object
};

export default withTooltipEvt(
  connect(getBasemapsProps, actions)(BasemapsContainer)
);
