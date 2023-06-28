import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class LegendTypeGradient extends PureComponent {
  static propTypes = {
    // Props
    activeLayer: PropTypes.shape({})
  }

  static defaultProps = {
    // Props
    activeLayer: {}
  }

  render() {
    const { activeLayer } = this.props;
    const { legendConfig } = activeLayer;

    if (!legendConfig || legendConfig.type !== 'gradient') {
      return null;
    }

    const items = legendConfig.items.filter(item => item.color !== 'transparent');
    const itemTransparent = legendConfig.items.find(item => item.color === 'transparent');
    const gradient = items.map(item => item.color);

    return (
      <div styleName="c-legend-type-gradient">
        <div styleName="legend-gradient-icon">
          {itemTransparent && (
            <div
              style={{ width: `${(1 / legendConfig.items.length) * 100}%` }}
              styleName="icon-gradient-transparent"
            />
          )}
          <div
            styleName="icon-gradient"
            style={{
              width: `${(items.length / legendConfig.items.length) * 100}%`,
              backgroundImage: `linear-gradient(to right, ${gradient.join(',')})`
            }}
          />
        </div>
        <ul>
          {legendConfig.items.map(({ name, color, value }) => name || value ? (
            <li key={`legend-gradient-item-${color}-${value}-${name}`}>
              <span styleName="name">
                {name || value}
              </span>
            </li>
          ) : null)}
        </ul>
      </div>
    );
  }
}

export default LegendTypeGradient;
