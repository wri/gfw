import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import { track } from 'utils/analytics';

import MenuPanel from 'pages/map/components/menu/components/menu-panel';
import MenuDesktop from './components/menu-desktop';
import MenuMobile from './components/menu-mobile';

import './menu-styles.scss';

class MapMenu extends PureComponent {
  onToggleLayer = (data, enable) => {
    const { activeDatasets } = this.props;
    const { dataset, layer, iso } = data;
    let newActiveDatasets = [...activeDatasets];
    if (!enable) {
      newActiveDatasets = remove(newActiveDatasets, l => l.dataset !== dataset);
    } else {
      newActiveDatasets = [
        {
          dataset,
          opacity: 1,
          visibility: true,
          layers: [layer],
          ...(iso &&
            iso.length === 1 && {
              iso: iso[0]
            })
        }
      ].concat([...newActiveDatasets]);
    }
    this.props.setMapSettings({
      datasets: newActiveDatasets || [],
      ...(enable && { canBound: true })
    });
    track(enable ? 'mapAddLayer' : 'mapRemoveLayer', {
      label: layer
    });
  };

  componentDidUpdate(prevProps) {
    const {
      showAnalysis,
      setMenuSettings,
      setRecentImagerySettings,
      location,
      recentVisible,
      menuSection,
      isDesktop
    } = this.props;
    if (
      !isDesktop &&
      location &&
      location.type &&
      location.adm0 &&
      !isEqual(location, prevProps.location)
    ) {
      showAnalysis();
    }

    if (!isDesktop && recentVisible) {
      setMenuSettings({ menuSection: 'recent-imagery' });
    }

    if (
      !isDesktop &&
      !menuSection &&
      !isEqual(menuSection, prevProps.menuSection)
    ) {
      setRecentImagerySettings({ visible: false });
    }

    if (!isEqual(isDesktop, prevProps.isDesktop)) {
      setMenuSettings({ menuSection: '' });
    }
  }

  render() {
    const {
      className,
      datasetSections,
      searchSections,
      mobileSections,
      activeSection,
      setMenuSettings,
      menuSection,
      loading,
      analysisLoading,
      embed,
      ...props
    } = this.props;
    const { Component, label, category, large, icon, ...rest } =
      activeSection || {};

    return (
      <MediaQuery minDeviceWidth={SCREEN_M}>
        {isDesktop => (
          <div className={cx('c-map-menu', className)}>
            <div
              className={cx('menu-tiles', { embed })}
              data-map-tour="step-one"
            >
              {isDesktop ? (
                <MenuDesktop
                  className="menu-desktop"
                  datasetSections={datasetSections}
                  searchSections={searchSections}
                  setMenuSettings={setMenuSettings}
                />
              ) : (
                <MenuMobile
                  sections={mobileSections}
                  setMenuSettings={setMenuSettings}
                />
              )}
            </div>
            <MenuPanel
              className="menu-panel"
              label={label}
              category={category}
              active={!!menuSection}
              large={large}
              isDesktop={isDesktop}
              setMenuSettings={setMenuSettings}
              onClose={() =>
                setMenuSettings({ menuSection: '', datasetCategory: '' })
              }
              loading={
                loading && menuSection !== 'analysis' && !analysisLoading
              }
            >
              {Component && (
                <Component
                  menuSection={menuSection}
                  isDesktop={isDesktop}
                  setMenuSettings={setMenuSettings}
                  onToggleLayer={this.onToggleLayer}
                  {...props}
                  {...rest}
                />
              )}
            </MenuPanel>
          </div>
        )}
      </MediaQuery>
    );
  }
}

MapMenu.propTypes = {
  sections: PropTypes.array,
  className: PropTypes.string,
  datasetSections: PropTypes.array,
  searchSections: PropTypes.array,
  mobileSections: PropTypes.array,
  activeSection: PropTypes.object,
  setMenuSettings: PropTypes.func,
  layers: PropTypes.array,
  setModalMeta: PropTypes.func,
  loading: PropTypes.bool,
  analysisLoading: PropTypes.bool,
  countries: PropTypes.array,
  selectedCountries: PropTypes.array,
  countriesWithoutData: PropTypes.array,
  activeDatasets: PropTypes.array,
  setMapSettings: PropTypes.func,
  handleClickLocation: PropTypes.func,
  getLocationFromSearch: PropTypes.func,
  exploreSection: PropTypes.string,
  menuSection: PropTypes.string,
  datasetCategory: PropTypes.string,
  showAnalysis: PropTypes.func,
  location: PropTypes.object,
  setRecentImagerySettings: PropTypes.func,
  recentVisible: PropTypes.bool,
  isDesktop: PropTypes.bool,
  embed: PropTypes.bool
};

export default MapMenu;
