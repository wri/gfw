import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from '../layer-toggle';
import LayerMoreInfo from '../layer-more-info';

import './styles.scss';

class LayerListMenu extends PureComponent {
  render() {
    const { className, layers, onToggle, onInfoClick } = this.props;

    return (
      <div className={`c-layer-list-menu ${className || ''}`}>
        {layers.map(
          (l, i) =>
            (!l.default ? (
              <div className="layer-toggle" key={l.id}>
                <LayerToggle
                  tabIndex={i}
                  data={{ ...l, layer: l.id }}
                  onToggle={onToggle}
                  onInfoClick={onInfoClick}
                  small
                />
                {l.moreInfo && (
                  <LayerMoreInfo className="more-info" {...l.moreInfo} />
                )}
              </div>
            ) : null)
        )}
      </div>
    );
  }
}

LayerListMenu.propTypes = {
  className: PropTypes.string,
  layers: PropTypes.array,
  onToggle: PropTypes.func,
  onInfoClick: PropTypes.func
};

export default LayerListMenu;
