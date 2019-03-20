import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MapLegend from 'components/map/components/legend';
import Analysis from 'components/map/components/analysis';
import SubNavMenu from 'components/subnav-menu';

import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  getLinks = () => {
    const {
      links,
      clearAnalysisError,
      setMainMapSettings,
      setMapSettings,
      showAnalysis,
      hidden
    } = this.props;

    return links.map(l => ({
      ...l,
      onClick: () => {
        setMainMapSettings({
          showAnalysis: l.showAnalysis,
          hideLegend:
            (showAnalysis && l.active && !hidden) ||
            (!showAnalysis && l.active && !hidden)
        });
        setMapSettings({ drawing: false });
        clearAnalysisError();
      }
    }));
  };

  render() {
    const { className, showAnalysis, menuSection, hidden, embed } = this.props;

    return (
      <div
        className={cx(
          'c-data-analysis-menu',
          'map-tour-legend',
          { relocate: !!menuSection && menuSection.Component },
          { big: menuSection && menuSection.large },
          { embed },
          className
        )}
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={this.getLinks()}
          checkActive
        />
        {!hidden && !showAnalysis && <MapLegend className="map-legend" />}
        {!hidden && showAnalysis && <Analysis className="map-analysis" />}
      </div>
    );
  }
}

DataAnalysisMenu.defaultProps = {
  tab: 'data'
};

DataAnalysisMenu.propTypes = {
  showAnalysis: PropTypes.bool,
  hidden: PropTypes.bool,
  className: PropTypes.string,
  menuSection: PropTypes.object,
  links: PropTypes.array,
  setMainMapSettings: PropTypes.func,
  setMapSettings: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  embed: PropTypes.bool
};

export default DataAnalysisMenu;
