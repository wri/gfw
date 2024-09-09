import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from 'utils/analytics';
import { translateText } from 'utils/lang';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Button from 'components/ui/button';

import Icon from 'components/ui/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import helpIcon from 'assets/icons/help.svg?sprite';

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
    const { className, layers, onInfoClick } = this.props;
    const { menuActive } = this.state;
    const activeLayer = layers && layers.find((l) => l.active);
    const layerList = layers.filter((l) => l.isSelector || l.default);

    if (layerList.length <= 1) return null;
    return (
      <div className={`c-layer-select-menu ${className || ''}`}>
        <div className="selector">
          <button onClick={() => this.setState({ menuActive: !menuActive })}>
            {translateText(activeLayer.name)}
            <span className="citation">
              {translateText(activeLayer.citation)}
            </span>
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
                    <button
                      id={`alerts-dropdown-${l.id}`}
                      onClick={() => this.handleClickLayer(l)}
                    >
                      <p>
                        {l.name}
                        <Tooltip
                          theme="tip"
                          hideOnClick
                          position="top"
                          animation="none"
                          html={(
                            <Tip
                              className="dynamic-content"
                              html={l.description}
                            />
                          )}
                          onShow={() =>
                            trackEvent({
                              category: 'Open modal',
                              action: 'Hover modal button',
                              label: `${l.layer}: ${
                                l?.applicationConfig?.metadata || l.description
                              }`,
                            })}
                        >
                          <Button
                            className="theme-button-tiny theme-button-grey-filled square info-button"
                            onClick={
                              l?.applicationConfig?.metadata &&
                              (() => onInfoClick(l.applicationConfig.metadata))
                            }
                          >
                            <Icon icon={helpIcon} />
                          </Button>
                        </Tooltip>
                      </p>
                      <span className="citation">{l.citation}</span>
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
