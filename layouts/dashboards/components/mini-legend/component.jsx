import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { trackEvent } from 'utils/analytics';
import moment from 'moment';
import lowerCase from 'lodash/lowerCase';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Tip from 'components/ui/tip';
import SatelliteBasemaps from 'components/satellite-basemaps';

import linkIcon from 'assets/icons/link.svg?sprite';

import { LegendItemButtonOpacity, Icons } from 'vizzuality-components';

import './styles.scss';

class MiniLegend extends PureComponent {
  handleOpacity(layer, opacity) {
    const { datasets, setMapSettings } = this.props;
    setMapSettings({
      datasets: datasets.map((dataset) => {
        if (dataset.dataset === layer.dataset) {
          return { ...dataset, opacity };
        }
        return dataset;
      }),
    });
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { layers, activeDatasets, setMainMapView, className } = this.props;
    return layers && layers.length ? (
      <div className={cx('c-mini-legend', className)}>
        <Icons />
        <div className="mini-legend-items">
          <ul className="mini-legend-layers">
            {layers.map((l) => {
              const { layers: subLayers, params: stateParams, name } = l || {};
              const params =
                stateParams ||
                (subLayers && subLayers[0] && subLayers[0].timelineParams);
              const { startDateAbsolute, endDateAbsolute } = params || {};
              const isVIIRS = name && lowerCase(name).includes('viirs');

              return (
                <li key={l.name}>
                  <span style={{ backgroundColor: l.color }} />
                  <div>
                    <p>{l.name}</p>
                    {startDateAbsolute && endDateAbsolute && (
                      <p className="time-range">
                        {`${moment(startDateAbsolute).format(
                          'MMM DD YYYY'
                        )} - ${moment(endDateAbsolute).format('MMM DD YYYY')}`}
                      </p>
                    )}
                    {isVIIRS && (
                      <p className="time-range-disclaimer">
                        *a maximum of 3 months of fires data can be shown on the
                        map
                      </p>
                    )}
                  </div>
                  <LegendItemButtonOpacity
                    className="-plain"
                    activeLayer={l}
                    defaultStyle={{ fill: 'rgb(153, 153, 153)' }}
                    focusStyle={{ fill: 'rgb(153, 153, 153)' }}
                    enabledStyle={{ fill: l.color }}
                    disabledStyle={{ fill: 'rgb(153, 153, 153)' }}
                    handleStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: 0,
                      boxShadow: 'rgba(0, 0, 0, 0.29) 0px 1px 2px 0px',
                    }}
                    trackStyle={[
                      { backgroundColor: '#97be32' },
                      { backgroundColor: '#d6d6d9' },
                    ]}
                    onChangeOpacity={(_, op) => this.handleOpacity(l, op)}
                  />
                </li>
              );
            })}
          </ul>
          <div className="link-to-map">
            <Button
              theme="theme-button-small square"
              onClick={() => {
                setMainMapView(activeDatasets);
                trackEvent({
                  category: 'Dashboards page',
                  action: 'User clicks through to main map',
                  label: layers?.map((l) => l.name).join(', '),
                });
              }}
              tooltip={{
                theme: 'tip',
                position: 'top',
                arrow: true,
                html: <Tip text="Explore the data on the global map" />,
              }}
            >
              <Icon icon={linkIcon} className="info-icon" />
            </Button>
          </div>
        </div>
        <div className="satellite-basemaps-wrapper">
          <SatelliteBasemaps />
        </div>
      </div>
    ) : null;
  }
}

MiniLegend.propTypes = {
  layers: PropTypes.array,
  setMainMapView: PropTypes.func,
  className: PropTypes.string,
  activeDatasets: PropTypes.array,
  datasets: PropTypes.array,
  setMapSettings: PropTypes.func,
};

export default MiniLegend;
