import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'app/analytics';
import reducerRegistry from 'app/registry';

import withTooltipEvt from 'components/ui/with-tooltip-evt';
import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import * as mapActions from 'components/maps/map/actions';

import reducers, { initialState } from './basemaps-reducers';
import * as ownActions from './basemaps-actions';
import { getBasemapsProps } from './basemaps-selectors';
import BasemapsComponent from './basemaps-component';

const actions = {
  setModalMetaSettings,
  ...mapActions,
  ...ownActions
};

class BasemapsContainer extends React.Component {
  static propTypes = {
    activeDatasets: PropTypes.array,
    activeBoundaries: PropTypes.object,
    setMapSettings: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getPlanetBasemaps();
  }

  selectBasemap = basemap => {
    const { labels, setMapSettings } = this.props;
    const label = labels[basemap.labelsKey] || labels.default;
    setMapSettings({ basemap, label: label.value });
    track('basemapChanged', {
      label: basemap.label
    });
  };

  selectLabels = label => {
    this.props.setMapSettings({ label: label.value });
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
  basemaps: PropTypes.object,
  labels: PropTypes.object,
  getPlanetBasemaps: PropTypes.func
};

reducerRegistry.registerModule('basemaps', {
  actions: ownActions,
  reducers,
  initialState
});

export default withTooltipEvt(
  connect(getBasemapsProps, actions)(BasemapsContainer)
);
