/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class LegendLayersTooltip extends PureComponent {
  static propTypes = {
    // Layers
    layers: PropTypes.array.isRequired,
    activeLayer: PropTypes.object.isRequired,
    // Callback to call when the layer changes with
    // the ID of the dataset and the ID of the layer
    onChangeLayer: PropTypes.func.isRequired,
  };

  render() {
    const { layers, activeLayer } = this.props;

    return (
      <div className="c-legend-item-button-layers-tooltip">
        Layers
        <ul className="layers-list">
          {layers.map((l) => (
            <li
              key={l.id}
              className={classnames({
                'layers-list-item': true,
                '-active': l.id === activeLayer.id,
              })}
              onClick={() => this.props.onChangeLayer(l)}
            >
              {l.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default LegendLayersTooltip;
