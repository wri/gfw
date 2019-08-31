import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
    locationData: PropTypes.object,
    setWidgetsData: PropTypes.func.isRequired,
    setWidgetsSettings: PropTypes.func.isRequired,
    setActiveWidget: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func.isRequired,
    setShareModal: PropTypes.func.isRequired
  };

  render() {
    const {
      className,
      noWidgetsMessage,
      loading,
      widgets,
      widgetsData,
      location,
      locationData,
      setWidgetsData,
      setWidgetsSettings,
      setActiveWidget,
      setModalMetaSettings,
      setShareModal
    } = this.props;

    return (
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
          widgets.map(w =>
            (<Widget
              key={w.widget}
              {...w}
              data={widgetsData && widgetsData[w.widget]}
              location={location}
              locationData={locationData}
              setWidgetData={data => setWidgetsData({ [w.widget]: data })}
              handleSetWidgetSettings={settings => setWidgetsSettings({ [w.widget]: settings })}
              handleShowMap={() => setActiveWidget(w.widget)}
              handleShowInfo={() => setModalMetaSettings(w.metaKey)}
              handleShowShare={() => setShareModal({
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
              })}
            />))
        }
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
    );
  }
}

export default Widgets;
