import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import { logEvent } from 'app/analytics';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import * as modalActions from 'components/modals/meta/actions';
import * as mapActions from 'components/map/actions';

import Component from './component';
import { getLegendProps } from './selectors';

const actions = {
  ...mapActions,
  ...modalActions
};

class Legend extends PureComponent {
  setMapSettings = change =>
    setComponentStateToUrl({
      key: 'map',
      change
    })

  onChangeOpacity = (currentLayer, opacity) => {
    const { activeDatasets } = this.props;
    this.setMapSettings({
      datasets: activeDatasets.map(d => {
        const activeDataset = { ...d };
        if (d.layers.includes(currentLayer.id)) {
          activeDataset.opacity = opacity;
        }
        return activeDataset;
      })
    });
  };

  onChangeOrder = layerGroupsIds => {
    const { activeDatasets } = this.props;
    const datasetIds = activeDatasets.map(d => d.dataset);
    const datasetsDiff = difference(datasetIds, layerGroupsIds);
    const newActiveDatasets = datasetsDiff
      .concat(layerGroupsIds)
      .map(id => activeDatasets.find(d => d.dataset === id));
    this.setMapSettings({ datasets: newActiveDatasets });
  };

  onToggleLayer = (layer, enable) => {
    const { activeDatasets, setMapSettings } = this.props;
    const { dataset } = layer;
    const newActiveDatasets = activeDatasets.map((newDataset, i) => {
      if (newDataset.dataset === dataset) {
        const newActiveDataset = activeDatasets[i];
        return {
          ...newActiveDataset,
          layers: enable
            ? [...newActiveDataset.layers, layer.layer]
            : newActiveDataset.layers.filter(l => l !== layer.layer)
        };
      }
      return newDataset;
    });
    this.setMapSettings({
      datasets: newActiveDatasets,
      ...(enable && { canBound: true })
    });
    logEvent(enable ? 'mapAddLayer' : 'mapRemoveLayer', {
      label: layer.layer
    });
  };

  onChangeLayer = (layerGroup, newLayerKey) => {
    const { activeDatasets } = this.props;
    this.setMapSettings({
      datasets: activeDatasets.map(l => {
        const dataset = l;
        if (l.dataset === layerGroup.dataset) {
          dataset.layers = [newLayerKey];
        }
        return dataset;
      })
    });
    logEvent('mapAddLayer', {
      label: newLayerKey
    });
  };

  onRemoveLayer = currentLayer => {
    const { setMapSettings } = this.props;
    const activeDatasets = [...this.props.activeDatasets];
    activeDatasets.forEach((l, i) => {
      if (l.dataset === currentLayer.dataset) {
        activeDatasets.splice(i, 1);
      }
    });
    this.setMapSettings({ datasets: activeDatasets });
    logEvent('mapRemoveLayer', {
      label: currentLayer.id
    });
  };

  onChangeInfo = metadata => {
    const { setModalMetaSettings } = this.props;
    if (metadata && typeof metadata === 'string') {
      setModalMetaSettings(metadata);
    }
  };

  onChangeTimeline = (dates, currentLayer) => {
    const { activeDatasets } = this.props;
    this.setMapSettings({
      datasets: activeDatasets.map(l => {
        const dataset = { ...l };
        if (l.layers.indexOf(currentLayer.id) > -1) {
          dataset.timelineParams = {
            ...dataset.timelineParams
          };
          dataset.timelineParams.startDate = dates[0];
          dataset.timelineParams.endDate = dates[1];
          dataset.timelineParams.trimEndDate = dates[2];
        }
        return dataset;
      })
    });
  };

  onChangeParam = (currentLayer, newParam) => {
    const { activeDatasets } = this.props;
    this.setMapSettings({
      datasets: activeDatasets.map(l => {
        const dataset = { ...l };
        if (l.layers.includes(currentLayer.id)) {
          dataset.params = {
            ...dataset.params,
            ...newParam
          };
        }
        return dataset;
      })
    });
  };

  onChangeDecodeParam = (currentLayer, newParam) => {
    const { activeDatasets } = this.props;
    this.setMapSettings({
      datasets: activeDatasets.map(l => {
        const dataset = { ...l };
        if (l.layers.includes(currentLayer.id)) {
          dataset.decodeParams = {
            ...dataset.params,
            ...newParam
          };
        }
        return dataset;
      })
    });
  };

  setConfirmed = layer => {
    const { activeDatasets, setMapSettings } = this.props;
    const { dataset } = layer;
    const datasetIndex = activeDatasets.findIndex(l => l.dataset === dataset);
    const newActiveDatasets = [...activeDatasets];
    let newDataset = newActiveDatasets[datasetIndex];
    newDataset = {
      ...newDataset,
      confirmedOnly: true
    };
    newActiveDatasets[datasetIndex] = newDataset;
    this.setMapSettings({ datasets: newActiveDatasets || [] });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      onChangeOpacity: this.onChangeOpacity,
      onChangeOrder: this.onChangeOrder,
      onToggleLayer: this.onToggleLayer,
      onChangeLayer: this.onChangeLayer,
      onRemoveLayer: this.onRemoveLayer,
      onChangeInfo: this.onChangeInfo,
      onChangeTimeline: this.onChangeTimeline,
      onChangeParam: this.onChangeParam,
      onChangeDecodeParam: this.onChangeDecodeParam,
      setConfirmed: this.setConfirmed
    });
  }
}

Legend.propTypes = {
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  setModalMetaSettings: PropTypes.func
};

export default connect(getLegendProps, actions)(Legend);
