import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LayerToggle from '../layer-toggle';

import './styles.scss';

class ThresholdSelector extends PureComponent {
  render() {
    const { className, layers, onToggle, onInfoClick } = this.props;

    return (
      <div className={`c-layer-list-menu ${className || ''}`}>
        {layers.map(
          l =>
            (!l.default ? (
              <div className="layer-toggle" key={l.id}>
                <LayerToggle
                  data={{ ...l, layer: l.id }}
                  onToggle={onToggle}
                  onInfoClick={onInfoClick}
                  small
                />
              </div>
            ) : null)
        )}
      </div>
    );
  }
}

ThresholdSelector.propTypes = {
  className: PropTypes.string,
  layers: PropTypes.array,
  onToggle: PropTypes.func,
  onInfoClick: PropTypes.func
};

export default ThresholdSelector;
