import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withTooltipEvt from 'components/ui/with-tooltip-evt';

import * as actions from 'components/map-v2/actions';
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
    if (basemap.dynamic) {
      if (basemap.id === 'landsat') {
        return this.props.setLandsatBasemap({
          year,
          defaultUrl: basemap.defaultUrl
        });
      }
    }
    return this.props.setMapSettings({ basemap });
  };

  selectLabels = label => this.props.setMapSettings({ label });

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

export default withTooltipEvt(
  connect(getBasemapsProps, actions)(BasemapsContainer)
);
