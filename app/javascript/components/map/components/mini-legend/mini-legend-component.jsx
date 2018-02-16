import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isTouch } from 'utils/browser';

import Button from 'components/button';
import Icon from 'components/icon';
import Tip from 'components/tip';

import linkIcon from 'assets/icons/link.svg';
import './mini-legend-styles.scss';

class MiniLegend extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { layers } = this.props;
    const layersKeys =
      layers && layers.length && layers.map(l => l.slug).join(',');
    const isDeviceTouch = isTouch();
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
        <div className="link-to-map">
          <Button
            theme="theme-button-small square"
            extLink={`/map/3/15.00/27.00/ALL/grayscale/${layersKeys}`}
            data={{
              title: 'view-full-map',
              layers: layersKeys
            }}
            tooltip={{
              theme: 'tip',
              position: 'top',
              arrow: true,
              disabled: isDeviceTouch,
              html: <Tip text="Explore the data on the global map" />
            }}
          >
            <Icon icon={linkIcon} className="info-icon" />
          </Button>
        </div>
      </div>
    );
  }
}

MiniLegend.propTypes = {
  layers: PropTypes.array
};

export default MiniLegend;
