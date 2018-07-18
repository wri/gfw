import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import remove from 'lodash/remove';

import Switch from 'components/ui/switch';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';

import './layer-toggle-styles.scss';

class LayerToggle extends PureComponent {
  render() {
    const { data: { name, description, meta, id, layer }, setModalMeta, setMapSettings, layers } = this.props;
    const isChecked = !!layers.find(l => l.dataset === id);
    console.log('layers', layers);
    return (
      <div className="c-layer-toggle">
        <Switch
          theme="theme-switch-toggle"
          checked={isChecked}
          onChange={value => {
            let newLayers = layers.splice(0);
            if (!value) {
              newLayers = remove(layers, l => l.dataset === id);
            } else {
              newLayers = [{
                dataset: id,
                opacity: 1,
                visibility: true,
                layer
              }].concat(newLayers);
            }
            setMapSettings({ layers: newLayers });
          }}
        />
        <div className="c-layer-toggle__content">
          <div className="c-layer-toggle__header">
            <div className="c-layer-toggle__name">{name}</div>
            <Button
              className="theme-button-tiny square info-button"
              onClick={() => setModalMeta(meta)}
            >
              <Icon icon={infoIcon} className="info-icon" />
            </Button>
          </div>
          <div className="c-layer-toggle__description">{description}</div>
        </div>
      </div>
    );
  }
}

LayerToggle.propTypes = {
  data: PropTypes.object,
  setModalMeta: PropTypes.func
};

export default LayerToggle;
