import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import { logEvent } from 'app/analytics';

import { BIOMASS_LOSS_DATASET } from 'data/layers-datasets';

import MenuPanel from './components/menu-panel';
import MenuDesktop from './components/menu-desktop';
import MenuMobile from './components/menu-mobile';

import './styles.scss';

class MapMenu extends PureComponent {
  onToggleLayer = (data, enable) => {
    const { activeDatasets, recentActive, zoom } = this.props;
    const { dataset, layer, iso, category } = data;

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

    // show recent imagery prompt
    if (!recentActive && enable && category === 'forestChange') {
      this.props.setMapPromptsSettings({
        stepsKey: 'recentImagery',
        stepsIndex: 0,
        open: true
      });
    }

    // show analysis prompts
    if (
      enable &&
      zoom > 3 &&
      (category === 'landUse' ||
        category === 'biodiversity' ||
        dataset === BIOMASS_LOSS_DATASET)
    ) {
      this.props.setMapPromptsSettings({
        stepsKey: 'analyzeAnArea',
        stepsIndex: 0,
        open: true
      });
    }

    logEvent(enable ? 'mapAddLayer' : 'mapRemoveLayer', {
      label: layer
    });
  };

  componentDidUpdate(prevProps) {
    const {
      showAnalysis,
      setMenuSettings,
      location,
      menuSection,
      recentActive,
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

    if (!isDesktop && !menuSection && recentActive) {
      setMenuSettings({ menuSection: 'recent-imagery-collapsed' });
    }

    if (
      !isEqual(isDesktop, prevProps.isDesktop) ||
      (!recentActive && !isEqual(recentActive, prevProps.recentActive))
    ) {
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
      isDesktop,
      ...props
    } = this.props;
    const {
      Component,
      label,
      category,
      large,
      icon,
      collapsed,
      openSection,
      ...rest
    } =
      activeSection || {};

    return (
      <div className={cx('c-map-menu', className)}>
        <div className={cx('menu-tiles', 'map-tour-data-layers', { embed })}>
          {isDesktop &&
            !embed && (
              <MenuDesktop
                className="menu-desktop"
                datasetSections={datasetSections}
                searchSections={searchSections}
                setMenuSettings={setMenuSettings}
              />
            )}
          {!isDesktop && (
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
          loading={loading}
          collapsed={collapsed}
          onClose={() =>
            setMenuSettings({ menuSection: '', datasetCategory: '' })
          }
          onOpen={() => setMenuSettings({ menuSection: openSection })}
        >
          {Component && (
            <Component
              menuSection={menuSection}
              isDesktop={isDesktop}
              setMenuSettings={setMenuSettings}
              onToggleLayer={this.onToggleLayer}
              {...props}
              {...menuSection === 'datasets' && {
                ...rest
              }}
            />
          )}
        </MenuPanel>
      </div>
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
  zoom: PropTypes.number,
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
  isDesktop: PropTypes.bool,
  embed: PropTypes.bool,
  recentActive: PropTypes.bool,
  setMapPromptsSettings: PropTypes.func
};

export default MapMenu;
