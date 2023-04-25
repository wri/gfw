import React from 'react';
import PropTypes from 'prop-types';

class LegendTypeChoropleth extends React.PureComponent {
  static propTypes = {
    activeLayer: PropTypes.shape({
      legendConfig: PropTypes.shape({
        type: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({})),
      }),
    }),
    dataset: PropTypes.string,
  };

  static defaultProps = {
    activeLayer: {},
    dataset: '',
  };

  render() {
    const { activeLayer, dataset } = this.props;
    const { legendConfig } = activeLayer;

    if (!legendConfig || legendConfig.type !== 'choropleth') {
      return null;
    }

    return (
      <>
        <div className={`c-legend-type-choropleth ${dataset}`}>
          <ul>
            {legendConfig.items.map(({ color }, i) => (
              <li
                key={`legend-choropleth-item-${color}-${i}`}
                style={{ width: `${100 / legendConfig.items.length}%` }}
              >
                <div
                  className="icon-choropleth"
                  style={{ backgroundColor: color }}
                />
              </li>
            ))}
          </ul>
          <ul>
            {legendConfig.items
              .filter((i) => i.value || i.name)
              .map(({ name, value, color, styles = {} }, i) => (
                <li
                  key={`legend-choropleth-item-${color}-${i}`}
                  style={{ width: `${100 / legendConfig.items.length}%` }}
                >
                  <span className="name" style={styles}>
                    {name || value}
                  </span>
                </li>
              ))}
          </ul>
          <ul>
            {legendConfig.items.map(({ label }) =>
              label ? (
                <li key={`legend-choropleth-item-${label}`}>
                  <span className="label">{label}</span>
                </li>
              ) : null
            )}
          </ul>
        </div>
        {/* TODO: Pedro: This is ugly, should be programatic */}
        {dataset === 'forest-net-change' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '.5rem 0 0',
            }}
          >
            <span
              style={{
                backgroundColor: '#B2B2B2',
                height: '0.625rem',
                width: '0.625rem',
                minHeight: '0.625rem',
                minWidth: '0.625rem',
                borderRadius: '50%',
                marginRight: '0.625rem',
              }}
            />
            <div>
              <p>&lt;1 ha forest extent</p>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default LegendTypeChoropleth;
