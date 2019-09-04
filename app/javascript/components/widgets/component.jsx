import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SCREEN_M } from 'utils/constants';
import { track } from 'app/analytics';
import MediaQuery from 'react-responsive';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import Widget from 'components/widget';

import './styles.scss';

class Widgets extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    noWidgetsMessage: PropTypes.string,
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
    query: PropTypes.object,
    embed: PropTypes.bool,
    modalClosing: PropTypes.bool,
    nonGlobalDatasets: PropTypes.object,
    activeWidget: PropTypes.object
  };

  render() {
    const {
      activeWidget,
      className,
      noWidgetsMessage,
      loading,
      widgets,
      widgetsData,
      query,
      location,
      locationObj,
      locationData,
      setWidgetsData,
      setWidgetSettings,
      setActiveWidget,
      setMapSettings,
      setModalMetaSettings,
      setShareModal,
      embed,
      modalClosing,
      nonGlobalDatasets
    } = this.props;

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div
            className={cx(
              'c-widgets',
              className,
              { simple: this.props.simple },
              {
                'no-widgets':
                  !loading &&
                  !noWidgetsMessage &&
                  (!widgets || widgets.length === 0)
              }
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
                  data={widgetsData && widgetsData[w.widget]}
                  settings={{
                    ...w.settings,
                    ...(query && query[w.widget])
                  }}
                  {...locationObj}
                  {...locationData}
                  location={location}
                  setWidgetData={data => setWidgetsData({ [w.widget]: data })}
                  handleChangeSettings={change =>
                    setWidgetSettings({ widget: w.widget, change })
                  }
                  handleShowMap={() => {
                    setActiveWidget(w.widget);
                    track('viewWidgetOnMap', {
                      label: `${w.widget} in ${locationObj.locationLabel || ''}`
                    });
                  }}
                  handleSyncMap={setMapSettings}
                  handleShowInfo={setModalMetaSettings}
                  handleShowShare={() =>
                    setShareModal({
                      title: 'Share this view',
                      shareUrl: window.location.href.includes('embed')
                        ? window.location.href.replace('/embed', '')
                        : window.location.href,
                      embedUrl: window.location.href.includes('embed')
                        ? window.location.href
                        : window.location.href.replace('/map', '/embed/map'),
                      embedSettings: {
                        width: 670,
                        height: 490
                      }
                    })
                  }
                  preventCloseSettings={modalClosing}
                  nonGlobalDatasets={nonGlobalDatasets}
                />
              ))}
            {!loading &&
              noWidgetsMessage &&
              (!widgets || widgets.length === 0) && (
              <NoContent
                className="no-widgets-message large"
                message={noWidgetsMessage}
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
