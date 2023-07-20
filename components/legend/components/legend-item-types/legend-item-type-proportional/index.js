import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LegendItemTypeProportional extends PureComponent {
  static propTypes = {
    activeLayer: PropTypes.shape({
      legendConfig: PropTypes.shape({
        type: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({})),
      }),
    }),
  };

  static defaultProps = {
    activeLayer: {},
  };

  render() {
    const { activeLayer } = this.props;
    const { legendConfig } = activeLayer;

    if (!legendConfig || legendConfig.type !== 'proportional') {
      return null;
    }

    return (
      <ul className="c-legend-type-proportional">
        {legendConfig.items.map(({ name, color, size }) => (
          <li key={`legend-proportional-item-${name}`}>
            <div
              className="icon-proportional"
              style={{ backgroundColor: color, width: size, height: size }}
            />
            <span className="name">{name}</span>
          </li>
        ))}
      </ul>
    );
  }
}

export default LegendItemTypeProportional;
