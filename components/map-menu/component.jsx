import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import remove from 'lodash/remove';
import { trackEvent } from 'utils/analytics';

import { BIOMASS_LOSS_DATASET } from 'data/datasets';

import MenuPanel from './components/menu-panel';
import MenuDesktop from './components/menu-desktop';
import MenuMobile from './components/menu-mobile';

class MapMenu extends PureComponent {
  onToggleLayer = (data, enable) => {
    const { activeDatasets, recentActive, zoom } = this.props;
    const { dataset, layer, iso, category } = data;

    let newActiveDatasets = [...activeDatasets];
    if (!enable) {
      newActiveDatasets = remove(
        newActiveDatasets,
        (l) => l.dataset !== dataset
      );
    } else {
      newActiveDatasets = [
        {
          dataset,
          opacity: 1,
          visibility: true,
          layers: [layer],
          ...(iso &&
            iso.length === 1 && {
              iso: iso[0],
            }),
        },
      ].concat([...newActiveDatasets]);
    }
    this.props.setMapSettings({
      datasets: newActiveDatasets || [],
      ...(enable && { canBound: true }),
    });

    // show recent imagery prompt
    if (!recentActive && enable && category === 'forestChange') {
      this.props.setMapPromptsSettings({
        stepsKey: 'recentImagery',
        stepsIndex: 0,
        open: true,
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
        open: true,
      });
    }

    trackEvent({
      category: 'Map data',
      action: enable ? 'User turns on a layer' : 'User turns off a layer',
      label: layer,
    });
  };

  onToggleMobileMenu = (slug) => {
    const { setMenuSettings, recentActive } = this.props;

    if (slug) {
      setMenuSettings({ menuSection: slug });
      trackEvent({
        category: 'Map menu',
        action: 'Select Map menu',
        label: slug,
      });
    } else {
      setMenuSettings({
        menuSection: recentActive ? 'recent-imagery-collapsed' : '',
      });
    }
  };

  // On Mobile, the <MenuPanel /> component is also used to display the legend and analysis.
  // On Desktop, the <DataAnalysisMenu /> is used instead. This causes issues when a user is on the
  // mobile version on a panel that does not exist on desktop, and switches to the desktop version;
  // because if a panel does not exist, it'll either be displayed as a blank panel (layer category
  // selection), or duplicate items (analysis).
  // Here we verify that the the panel in question does exist on the desktop version, and if not, we
  // switch the user to the more relevant panel.
  verifyMenuSettings = () => {
    const { menuSection, activeSection, isDesktop, setMenuSettings } =
      this.props;

    if (!activeSection) return null;
    if (!isDesktop || !menuSection) return null;

    const clearMenuSettings = () =>
      setMenuSettings({ menuSection: null, datasetCategory: null });

    if (['analysis', 'legend'].includes(menuSection)) clearMenuSettings();
    if (menuSection === 'datasets' && !activeSection?.category)
      clearMenuSettings();

    return null;
  };

  // When the user is on mobile, on the legend panel, upon switching to a desktop the "analysis"
  // one is displayed instead. Here we try to sync the current selection. Note that this is not
  // possible the other way around; on desktop we display multiple panels.
  syncMapMenuSettings = () => {
    const { menuSection, setMainMapSettings, isDesktop } = this.props;

    if (isDesktop) return null;
    if (!['analysis', 'legend'].includes(menuSection)) return null;

    const showAnalysis = menuSection === 'analysis';
    setMainMapSettings({ showAnalysis });

    return null;
  };

  render() {
    this.verifyMenuSettings();
    this.syncMapMenuSettings();

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
      recentActive,
      ...props
    } = this.props;
    const {
      Component,
      label,
      slug,
      category,
      large,
      icon,
      collapsed,
      openSection,
      ...rest
    } = activeSection || {};

    return (
      <div className={cx('c-map-menu', className)}>
        <div className={cx('menu-tiles', 'map-tour-data-layers', { embed })}>
          {isDesktop && !embed && (
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
              onToggleMenu={this.onToggleMobileMenu}
            />
          )}
        </div>
        <MenuPanel
          className={cx('menu-panel', menuSection)}
          label={label}
          category={category}
          active={!!menuSection}
          large={large}
          isDesktop={isDesktop}
          setMenuSettings={setMenuSettings}
          loading={loading}
          collapsed={collapsed}
          onClose={() =>
            setMenuSettings({
              menuSection:
                !isDesktop && recentActive ? 'recent-imagery-collapsed' : '',
              datasetCategory: '',
            })}
          onOpen={() => setMenuSettings({ menuSection: openSection })}
        >
          {Component && (
            <Component
              menuSection={menuSection}
              isDesktop={isDesktop}
              setMenuSettings={setMenuSettings}
              onToggleLayer={this.onToggleLayer}
              {...props}
              {...(menuSection === 'datasets' && {
                ...rest,
              })}
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
  setMainMapSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
};

export default MapMenu;
