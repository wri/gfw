import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';

import LayerMoreInfo from '../layer-more-info';

import './styles.scss';

class LayerSelectMenu extends PureComponent {
  state = {
    menuActive: false,
  };

  handleClickLayer(layer) {
    const { onSelectLayer } = this.props;
    onSelectLayer(layer);
    this.setState({ menuActive: false });
  }

  render() {
    const { className, layers } = this.props;
    const { menuActive } = this.state;
    const activeLayer = layers && layers.find((l) => l.active);
    const layerList = layers.filter((l) => l.isSelector || l.default);

    if (layerList.length <= 1) return null;

    return (
      <div className={`c-layer-select-menu ${className || ''}`}>
        <div className="selector">
          <button onClick={() => this.setState({ menuActive: !menuActive })}>
            {activeLayer.name}
            <span className="citation">{activeLayer.citation}</span>
            <Icon
              icon={arrowDownIcon}
              className={`icon-arrow ${menuActive ? 'reverse' : ''}`}
            />
          </button>
          {menuActive && (
            <ul className="options">
              {layers.map((l) =>
                l.isSelector || l.default ? (
                  <li
                    className={`layer-options ${
                      l.id === activeLayer.id ? 'active' : ''
                    }`}
                    key={`${l.id}-${l.name}`}
                  >
                    <button onClick={() => this.handleClickLayer(l)}>
                      <p>{l.name}</p>
                      <span className="citation">{l.citation}</span>
                      {l.moreInfo && (
                        <LayerMoreInfo className="more-info" {...l.moreInfo} />
                      )}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

LayerSelectMenu.propTypes = {
  className: PropTypes.string,
  layers: PropTypes.array,
  onSelectLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
};

export default LayerSelectMenu;
