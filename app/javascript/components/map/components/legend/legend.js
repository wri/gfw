import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import modalActions from 'components/modals/meta/meta-actions';
import mapActions from 'components/map/map-actions';

import { getLayers, getLayerGroups } from '../../map-selectors';
import Component from './legend-component';

const actions = {
  ...mapActions,
  ...modalActions
};

const mapStateToProps = ({ location, datasets }) => ({
  layers: getLayers({ ...location }),
  layerGroups: getLayerGroups({ ...datasets, ...location }),
  ...datasets
});

class Legend extends PureComponent {
  onChangeOpacity = (currentLayer, opacity) => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = { ...l };
        if (l.layer === currentLayer.id) {
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
        if (l.layer === currentLayer.id) {
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

  onChangeLayer = currentLayer => {
    const { setMapSettings, layers } = this.props;
    setMapSettings({
      layers: layers.map(l => {
        const layer = l;
        if (l.dataset === currentLayer.dataset) {
          layer.layer = currentLayer.id;
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

  onChangeInfo = layer => {
    const { setModalMeta } = this.props;
    setModalMeta(layer.layerConfig.body.metadata);
  };

  render() {
    return createElement(Component, {
      ...this.props,
      onChangeOpacity: this.onChangeOpacity,
      onChangeVisibility: this.onChangeVisibility,
      onChangeOrder: this.onChangeOrder,
      onChangeLayer: this.onChangeLayer,
      onRemoveLayer: this.onRemoveLayer,
      onChangeInfo: this.onChangeInfo
    });
  }
}

Legend.propTypes = {
  layers: PropTypes.array,
  setMapSettings: PropTypes.func,
  setModalMeta: PropTypes.func
};

export default connect(mapStateToProps, actions)(Legend);
