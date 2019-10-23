import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import MediaQuery from 'react-responsive';

import { SCREEN_M } from 'utils/constants';
import { track } from 'app/analytics';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Widget from 'components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    widgets: PropTypes.array,
    widgetsData: PropTypes.object,
    simple: PropTypes.bool,
    location: PropTypes.object,
    locationObj: PropTypes.object,
    locationData: PropTypes.object,
    setWidgetsData: PropTypes.func.isRequired,
    setWidgetSettings: PropTypes.func.isRequired,
    setActiveWidget: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func.isRequired,
    setShareModal: PropTypes.func.isRequired,
    setMapSettings: PropTypes.func.isRequired,
    embed: PropTypes.bool,
    modalClosing: PropTypes.bool,
    activeWidget: PropTypes.object,
    noDataMessage: PropTypes.string,
    geostore: PropTypes.object
  };

  render() {
    const {
      activeWidget,
      className,
      widgets,
      location,
      loading,
      setWidgetsData,
      setWidgetSettings,
      setActiveWidget,
      setModalMetaSettings,
      setShareModal,
      embed,
      simple,
      modalClosing,
      noDataMessage,
      geostore
    } = this.props;
    const hasWidgets = !isEmpty(widgets);

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div
            className={cx(
              'c-widgets',
              className,
              { simple: this.props.simple },
              { 'no-widgets': !hasWidgets }
            )}
          >
            {loading && <Loader className="widgets-loader large" />}
            {!loading &&
              widgets &&
              widgets.map(w => (
                <Widget
                  key={w.widget}
                  {...w}
                  large={w.large && isDesktop}
                  active={activeWidget && activeWidget.widget === w.widget}
                  embed={embed}
                  simple={simple}
                  location={location}
                  geostore={geostore}
                  setWidgetData={data => setWidgetsData({ [w.widget]: data })}
                  handleChangeSettings={change =>
                    setWidgetSettings({ widget: w.widget, change })
                  }
                  handleShowMap={() => {
                    setActiveWidget(w.widget);
                    track('viewWidgetOnMap', {
                      label: `${w.widget} in ${w.locationLabel || ''}`
                    });
                  }}
                  handleShowInfo={setModalMetaSettings}
                  handleShowShare={() =>
                    setShareModal({
                      title: 'Share this widget',
                      shareUrl: w.shareUrl,
                      embedUrl: w.embedUrl,
                      embedSettings: !w.large
                        ? { width: 315, height: 460 }
                        : { width: 630, height: 460 }
                    })
                  }
                  preventCloseSettings={modalClosing}
                />
              ))}
            {!loading &&
              !hasWidgets &&
              !simple && (
              <NoContent
                className="no-widgets-message large"
                message={noDataMessage}
                icon
              />
            )}
          </div>
        )}
      </MediaQuery>
    );
  }
}

export default Widgets;
