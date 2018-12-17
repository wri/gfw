import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isTouch } from 'utils/browser';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Tip from 'components/ui/tip';

import linkIcon from 'assets/icons/link.svg';
import './styles.scss';

class MiniLegend extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { layers, activeDatasets, setMainMapView, className } = this.props;
    const isDeviceTouch = isTouch();
    return layers && layers.length ? (
      <div className={cx('c-mini-legend', className)}>
        <ul>
          {layers.map(l => (
            <li key={l.name}>
              <span style={{ backgroundColor: l.color }} />
              {l.name}
            </li>
          ))}
        </ul>
        <div className="link-to-map">
          <Button
            theme="theme-button-small square"
            onClick={() => setMainMapView(activeDatasets)}
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
    ) : null;
  }
}

MiniLegend.propTypes = {
  layers: PropTypes.array,
  setMainMapView: PropTypes.func,
  className: PropTypes.string,
  activeDatasets: PropTypes.array
};

export default MiniLegend;
