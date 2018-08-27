import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withTooltipEvt from 'components/ui/with-tooltip-evt';
import { setMapSettings, setLandsatBasemap } from 'components/map-v2/actions';
import {
  getBasemap,
  getLabels,
  getLayers,
  getMapZoom,
  getActiveBoundaries,
  getBoundaryDatasets
} from 'components/map-v2/selectors';
import BasemapsComponent from './basemaps-component';

function mapStateToProps({ datasets, location, latest, countryData }) {
  return {
    layers: getLayers(location),
    mapZoom: getMapZoom(location),
    activeLabels: getLabels(location),
    activeBasemap: getBasemap(location),
    boundaries: getBoundaryDatasets({
      query: location.query,
      datasets: datasets.datasets,
      latest: latest.data,
      countries: countryData.countries
    }),
    activeBoundaries: getActiveBoundaries({
      query: location.query,
      datasets: datasets.datasets,
      latest: latest.data,
      countries: countryData.countries
    })
  };
}

class BasemapsContainer extends React.Component {
  static propTypes = {
    layers: PropTypes.array,
    activeBoundaries: PropTypes.object,
    setMapSettings: PropTypes.func.isRequired,
    setLandsatBasemap: PropTypes.func.isRequired
  };

  selectBasemap = (basemap, year) => {
    if (basemap.dynamic) {
      if (basemap.id === 'landsat') {
        return this.props.setLandsatBasemap(year, basemap.defaultUrl);
      }
    }
    return this.props.setMapSettings({ basemap });
  };

  selectLabels = label => this.props.setMapSettings({ label });

  selectBoundaries = item => {
    const { layers, activeBoundaries } = this.props;
    const filteredLayers = activeBoundaries
      ? layers.filter(l => l.dataset !== activeBoundaries.dataset)
      : layers;
    if (item.value) {
      const newLayers = [
        {
          ...item.value,
          opacity: 1,
          visibility: true
        },
        ...filteredLayers
      ];
      this.props.setMapSettings({ layers: newLayers });
    } else {
      this.props.setMapSettings({ layers: filteredLayers });
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
  connect(mapStateToProps, {
    setMapSettings,
    setLandsatBasemap
  })(BasemapsContainer)
);
