import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';
import MediaQuery from 'react-responsive';
import { Tooltip } from 'react-tippy';

import Tip from 'components/ui/tip';
import Map from 'components/map';
import SubscribeModal from 'components/modals/subscribe';
import ModalWelcome from 'components/modals/welcome';

import MapTour from 'pages/map/components/map-tour';
import RecentImagery from 'pages/map/components/recent-imagery';
import DataAnalysisMenu from 'pages/map/components/data-analysis-menu';
import MapControlButtons from 'pages/map/components/map-controls';

import './styles.scss';

class MainMapComponent extends PureComponent {
  renderInfoTooltip = string => (
    <div>
      <p className="tooltip-info">{string}</p>
    </div>
  );

  render() {
    const {
      embed,
      hidePanels,
      oneClickAnalysis,
      setMainMapAnalysisView,
      showTooltip,
      tooltipData,
      handleClickMap,
      handleShowTooltip
    } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-map-main', { embed })}>
            <div
              className="main-map-container"
              role="button"
              tabIndex={0}
              onClick={handleClickMap}
              onMouseOver={() =>
                oneClickAnalysis &&
                handleShowTooltip(true, 'Click shape to analyze.')
              }
              onMouseOut={() => handleShowTooltip(false, '')}
            >
              <Tooltip
                className="map-tooltip"
                theme="tip"
                html={
                  <Tip
                    className="map-hover-tooltip"
                    text={this.renderInfoTooltip(tooltipData)}
                  />
                }
                position="top"
                followCursor
                hideOnClick
                animateFill={false}
                open={showTooltip}
                disabled={!isDesktop}
              >
                <Map
                  className="main-map"
                  onDrawComplete={geoJson => {
                    // get geostore if from geometry
                    // use result to set url
                  }}
                  onSelectBoundary={setMainMapAnalysisView}
                  popupActions={[
                    {
                      label: 'Analyze',
                      action: setMainMapAnalysisView
                    }
                  ]}
                />
              </Tooltip>
            </div>
            {isDesktop &&
              !hidePanels && (
                <DataAnalysisMenu
                  className="data-analysis-menu"
                  embed={embed}
                />
              )}
            {!embed && (
              <MapControlButtons
                className="main-map-controls"
                isDesktop={isDesktop}
              />
            )}
            <RecentImagery />
            <SubscribeModal />
            {!embed &&
              isDesktop && (
                <Fragment>
                  <MapTour />
                  <ModalWelcome />
                </Fragment>
              )}
          </div>
        )}
      </MediaQuery>
    );
  }
}

MainMapComponent.propTypes = {
  handleShowTooltip: PropTypes.func,
  handleClickMap: PropTypes.func,
  setMainMapAnalysisView: PropTypes.func,
  oneClickAnalysis: PropTypes.bool,
  embed: PropTypes.bool,
  hidePanels: PropTypes.bool,
  tooltipData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  showTooltip: PropTypes.bool
};

export default MainMapComponent;
