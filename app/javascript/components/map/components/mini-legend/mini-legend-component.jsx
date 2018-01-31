import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Icon from 'components/icon';

import linkIcon from 'assets/icons/flechita.svg';
import './mini-legend-styles.scss';

class MiniLegend extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { layers } = this.props;
    const layersKeys =
      layers && layers.length && layers.map(l => l.slug).join(',');
    return (
      <div className="c-mini-legend">
        <ul>
          {layers.map(l => (
            <li key={l.slug}>
              <span style={{ backgroundColor: l.title_color }} />
              {l.title}
            </li>
          ))}
        </ul>
        <Button
          className="link-to-map"
          theme="theme-button-small square"
          extLink={`/map/3/15.00/27.00/ALL/grayscale/${layersKeys}`}
        >
          <Icon icon={linkIcon} className="info-icon" />
        </Button>
      </div>
    );
  }
}

MiniLegend.propTypes = {
  layers: PropTypes.array
};

export default MiniLegend;
