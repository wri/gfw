import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

class LegendTypeChoropleth extends React.PureComponent {
  static propTypes = {
    activeLayer: PropTypes.shape({})
  }

  static defaultProps = {
    activeLayer: {}
  }

  render() {
    const { activeLayer } = this.props;
    const { legendConfig } = activeLayer;

    if (!legendConfig || legendConfig.type !== 'choropleth') {
      return null;
    }

    return (
      <div styleName="c-legend-type-choropleth">
        <ul>
          {legendConfig.items.map(({ color }, i) => (
            <li key={`legend-choropleth-item-${color}-${i}`} style={{ width: `${(100 / legendConfig.items.length)}%` }}>
              <div styleName="icon-choropleth" style={{ backgroundColor: color }} />
            </li>
          ))}
        </ul>
        <ul>
          {legendConfig.items.filter(i => i.value || i.name).map(({ name, value, color, styles = {} }, i) => (
            <li key={`legend-choropleth-item-${color}-${i}`} style={{ width: `${(100 / legendConfig.items.length)}%` }}>
              <span styleName="name" style={styles}>
                {name || value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default LegendTypeChoropleth;
