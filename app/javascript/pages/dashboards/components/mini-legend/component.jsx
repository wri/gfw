import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isTouch } from 'utils/browser';
import cx from 'classnames';
import { track } from 'app/analytics';
import moment from 'moment';

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
          {layers.map(l => {
            const { layers: subLayers, params: stateParams } = l || {};
            const params = stateParams || (subLayers && subLayers[0] && subLayers[0].timelineParams);
            const { startDateAbsolute, endDateAbsolute } = params || {};

            return (
              <li key={l.name}>
                <span style={{ backgroundColor: l.color }} />
                <div>
                  <p>
                    {l.name}
                  </p>
                  <p className="time-range">
                    {startDateAbsolute && endDateAbsolute && (
                      `${moment(startDateAbsolute).format('MMM DD YYYY')} - ${moment(endDateAbsolute).format('MMM DD YYYY')}`
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="link-to-map">
          <Button
            theme="theme-button-small square"
            onClick={() => {
              setMainMapView(activeDatasets);
              track('visitMainMapFromDashboard', {
                label: layers && layers.map(l => l.name).join(', ')
              });
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
