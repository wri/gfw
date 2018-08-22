import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';

import modalActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map/map-actions';

import { getLayers, getLayerGroups } from '../../map-selectors';
import Component from './legend-component';

const actions = {
  ...mapActions,
  ...modalActions
};

const mapStateToProps = ({ location, datasets, countryData }) => ({
  layers: getLayers({ ...location }),
  layerGroups: getLayerGroups({ ...datasets, ...location, ...countryData }),
  ...datasets
});

class Legend extends PureComponent {
  onChangeOpacity = (currentLayer, opacity) => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = { ...l };
        if (l.layers.indexOf(currentLayer.id) > -1) {
          layer.opacity = opacity;
        }
        return layer;
      })
    });
  };

  onChangeVisibility = currentLayer => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = { ...l };
        if (l.layers.indexOf(currentLayer.id) > -1) {
          layer.visibility = !layer.visibility;
        }
        return layer;
      })
    });
  };

  onChangeOrder = layerGroupsIds => {
    const { setMapSettings, layers } = this.props;
    const newLayers = layerGroupsIds.map(id =>
      layers.find(d => d.dataset === id)
    );
    setMapSettings({ layers: newLayers });
  };

  onToggleLayer = (layer, value) => {
    const { layers, setMapSettings } = this.props;
    const { dataset } = layer;
    const datasetIndex = layers.findIndex(l => l.dataset === dataset);
    const newLayers = [...layers];
    let newDataset = newLayers[datasetIndex];
    newDataset = {
      ...newDataset,
      layers: !value
        ? remove(newDataset.layers, l => l !== layer.layer)
        : [...newDataset.layers, layer.layer]
    };
    newLayers[datasetIndex] = newDataset;
    setMapSettings({ layers: newLayers || [] });
  };

  onChangeLayer = (layerGroup, newLayerKey) => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = l;
        if (l.dataset === layerGroup.dataset) {
          layer.layers = [newLayerKey];
        }
        return layer;
      })
    });
  };

  onRemoveLayer = currentLayer => {
    const { setMapSettings } = this.props;
    const layers = this.props.layers.splice(0);
    layers.forEach((l, i) => {
      if (l.dataset === currentLayer.dataset) {
        layers.splice(i, 1);
      }
    });
    setMapSettings({ layers });
  };

  onChangeInfo = metadata => {
    const { setModalMeta } = this.props;
    if (metadata && typeof metadata === 'string') {
      setModalMeta(metadata);
    }
  };

  onChangeTimeline = (currentLayer, range) => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = { ...l };
        if (l.layers.indexOf(currentLayer.id) > -1) {
          layer.decodeParams = {
            ...layer.decodeParams
          };
          layer.decodeParams.startDate = range[0];
          layer.decodeParams.endDate = range[1];
          layer.decodeParams.trimEndDate = range[2];
        }
        return layer;
      })
    });
  };

  onChangeParam = (currentLayer, newParam) => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = { ...l };
        if (l.layers.includes(currentLayer.id)) {
          layer.params = {
            ...layer.params,
            ...newParam
          };
        }
        return layer;
      })
    });
  };

  setConfirmed = layer => {
    const { layers, setMapSettings } = this.props;
    const { dataset } = layer;
    const datasetIndex = layers.findIndex(l => l.dataset === dataset);
    const newLayers = [...layers];
    let newDataset = newLayers[datasetIndex];
    newDataset = {
      ...newDataset,
      confirmedOnly: true
    };
    newLayers[datasetIndex] = newDataset;
    setMapSettings({ layers: newLayers || [] });
  };

  render() {
    return createElement(Component, {
      ...this.props,
      onChangeOpacity: this.onChangeOpacity,
      onChangeVisibility: this.onChangeVisibility,
      onChangeOrder: this.onChangeOrder,
      onToggleLayer: this.onToggleLayer,
      onChangeLayer: this.onChangeLayer,
      onRemoveLayer: this.onRemoveLayer,
      onChangeInfo: this.onChangeInfo,
      onChangeTimeline: this.onChangeTimeline,
      onChangeParam: this.onChangeParam,
      setConfirmed: this.setConfirmed
    });
  }
}

Legend.propTypes = {
  layers: PropTypes.array,
  setMapSettings: PropTypes.func,
  setModalMeta: PropTypes.func
};

export default connect(mapStateToProps, actions)(Legend);
