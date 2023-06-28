import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class LegendTypeGradient extends PureComponent {
  static propTypes = {
    // Props
    activeLayer: PropTypes.object
  }

  static defaultProps = {
    // Props
    activeLayer: {}
  }

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
            <span className="name">
              {name}
            </span>
          </li>
        ))}
      </ul>
    );
  }
}

export default LegendTypeGradient;
