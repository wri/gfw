import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import { SCREEN_M } from 'utils/constants';
import upperFirst from 'lodash/upperFirst';
import cx from 'classnames';

import Map from 'components/maps/map';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import MediaQuery from 'react-responsive';
import RecentImagery from 'components/map-v2/components/recent-imagery';
import SubscribeModal from 'components/modals/subscribe';

import MapControlButtons from 'components/maps/components/map-controls';
import DataAnalysisMenu from 'components/maps/components/data-analysis-menu';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

  renderDataTooltip = data => (
    <div>
      {Object.keys(data).map(key => (
        <p key={key}>
          <strong>{upperFirst(startCase(key).toLowerCase())}</strong>:{' '}
          {data[key]}
        </p>
      ))}
      <p className="view-more">Click to view more.</p>
    </div>
  );

  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      basemap,
      tooltipData,
      showTooltip,
      handleShowTooltip,
      oneClickAnalysisActive,
      embed,
      hidePanels,
      onMapClick
    } = this.props;

    return (
      <div
        className="c-map"
        style={{ backgroundColor: basemap.color }}
        onMouseOver={() =>
          oneClickAnalysisActive &&
          handleShowTooltip(true, 'Click shape to analyze.')
        }
        onMouseOut={() => handleShowTooltip(false, '')}
      >
        <MediaQuery minDeviceWidth={SCREEN_M}>
          {isDesktop => (
            <Fragment>
              <Tooltip
                className="map-tooltip"
                theme="tip"
                hideOnClick
                html={
                  <Tip
                    className="map-hover-tooltip"
                    text={
                      typeof tooltipData === 'string'
                        ? this.renderInfoTooltip(tooltipData)
                        : this.renderDataTooltip(tooltipData)
                    }
                  />
                }
                position="top"
                followCursor
                animateFill={false}
                open={showTooltip}
                disabled={!isDesktop}
              >
                <div
                  className="map-click-container"
                  onClick={onMapClick}
                  role="button"
                  tabIndex={0}
                >
                  <Map />
                </div>
              </Tooltip>
              {isDesktop &&
                !hidePanels && (
                  <DataAnalysisMenu
                    className={cx('data-analysis-menu', { embed })}
                    embed={embed}
                  />
                )}
              {!embed && (
                <MapControlButtons
                  className="map-controls"
                  embed={embed}
                  isDesktop={isDesktop}
                />
              )}
              <RecentImagery />
              <SubscribeModal />
            </Fragment>
          )}
        </MediaQuery>
      </div>
    );
  }
}

MapComponent.propTypes = {
  basemap: PropTypes.object,
  tooltipData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  showTooltip: PropTypes.bool,
  handleShowTooltip: PropTypes.func,
  onMapClick: PropTypes.func,
  oneClickAnalysisActive: PropTypes.bool,
  embed: PropTypes.bool,
  hidePanels: PropTypes.bool
};

export default MapComponent;
