import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { trackEvent } from 'utils/analytics';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Widget from 'components/widget';

class Widgets extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loadingData: PropTypes.bool,
    loadingMeta: PropTypes.bool,
    widgets: PropTypes.array,
    widgetsGroupedBySubcategory: PropTypes.array,
    widgetsData: PropTypes.object,
    simple: PropTypes.bool,
    location: PropTypes.object,
    locationObj: PropTypes.object,
    locationData: PropTypes.object,
    setWidgetsData: PropTypes.func.isRequired,
    setWidgetsChartSettings: PropTypes.func.isRequired,
    setWidgetSettings: PropTypes.func.isRequired,
    setWidgetInteractionByKey: PropTypes.func.isRequired,
    setActiveWidget: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func.isRequired,
    setShareModal: PropTypes.func.isRequired,
    setMapSettings: PropTypes.func.isRequired,
    handleClickWidget: PropTypes.func.isRequired,
    embed: PropTypes.bool,
    analysis: PropTypes.bool,
    dashboard: PropTypes.bool,
    groupBySubcategory: PropTypes.bool,
    modalClosing: PropTypes.bool,
    activeWidget: PropTypes.object,
    noDataMessage: PropTypes.string,
    geostore: PropTypes.object,
    meta: PropTypes.object,
    authenticated: PropTypes.bool,
  };

  render() {
    const {
      activeWidget,
      className,
      widgets: allWidgets = [],
      widgetsGroupedBySubcategory: groupedWidgets = [],
      location,
      loadingData,
      loadingMeta,
      setWidgetsData,
      setWidgetsChartSettings,
      setWidgetSettings,
      setWidgetInteractionByKey,
      setActiveWidget,
      setModalMetaSettings,
      setShareModal,
      groupBySubcategory = false,
      embed,
      dashboard,
      analysis,
      simple,
      modalClosing,
      noDataMessage,
      geostore,
      meta,
      handleClickWidget,
      authenticated,
    } = this.props;

    const widgetGroups = groupBySubcategory
      ? groupedWidgets
      : [{ id: null, label: null, widgets: allWidgets }];

    const hasWidgets = !isEmpty(allWidgets) && !isEmpty(widgetGroups);

    return (
      <div
        className={cx(
          'c-widgets',
          className,
          { simple },
          { embed },
          { 'no-widgets': !hasWidgets }
        )}
      >
        {loadingData && <Loader className="widgets-loader large" />}

        {!loadingData && hasWidgets && (
          <>
            {widgetGroups.map(({ id, label, widgets = [] }, index) => (
              <div
                key={index}
                id={id}
                className={cx(
                  'c-widgets',
                  className,
                  { simple },
                  { embed },
                  { 'no-widgets': !hasWidgets }
                )}
              >
                {label && (
                  <div className="c-widgets-subcategory-title">{label}</div>
                )}
                {widgets.map((w) => (
                  <Widget
                    key={w.widget}
                    {...w}
                    large={w.large}
                    authenticated={authenticated}
                    active={activeWidget && activeWidget.widget === w.widget}
                    embed={embed}
                    analysis={analysis}
                    dashboard={dashboard}
                    simple={simple}
                    location={location}
                    geostore={geostore}
                    meta={meta}
                    metaLoading={loadingMeta || loadingData}
                    setWidgetData={(data) => {
                      setWidgetsData({ [w.widget]: data });
                    }}
                    setWidgetChartSettings={(chartSettings) => {
                      setWidgetsChartSettings({ [w.widget]: chartSettings });
                    }}
                    handleSetInteraction={(payload) =>
                      setWidgetInteractionByKey({
                        key: w.widget,
                        payload,
                      })}
                    handleChangeSettings={(change) => {
                      setWidgetSettings({
                        widget: w.widget,
                        change: {
                          ...change,
                          ...(change.forestType === 'ifl' &&
                            w.settings &&
                            w.settings.extentYear && {
                              extentYear:
                                w.settings.ifl === '2016' ? 2010 : 2000,
                            }),
                          ...(change.forestType === 'primary_forest' &&
                            w.settings &&
                            w.settings.extentYear && {
                              extentYear: 2000,
                            }),
                        },
                      });
                    }}
                    handleShowMap={() => {
                      setActiveWidget(w.widget);
                      trackEvent({
                        category: 'Dashboards page',
                        action: 'User views a widget on the map',
                        label: w.widget,
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
                          : { width: 630, height: 460 },
                      })}
                    preventCloseSettings={modalClosing}
                    onClickWidget={handleClickWidget}
                  />
                ))}
              </div>
            ))}
          </>
        )}

        {!loadingData && !hasWidgets && !simple && (
          <NoContent
            className="no-widgets-message large"
            message={noDataMessage}
            icon
          />
        )}
      </div>
    );
  }
}

export default Widgets;
