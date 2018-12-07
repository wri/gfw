import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MapLegend from 'components/maps/components/legend';
import Analysis from 'components/maps/components/analysis';
import SubNavMenu from 'components/subnav-menu';

import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  render() {
    const {
      className,
      showAnalysis,
      menuSection,
      links,
      setMapMainSettings,
      clearAnalysisError,
      hidden,
      embed
    } = this.props;

    return (
      <div
        className={cx(
          'c-data-analysis-menu',
          'map-tour-legend',
          { '-relocate': !!menuSection },
          { '-big': menuSection && menuSection.large },
          { '-embed': embed },
          className
        )}
        data-map-tour="step-two"
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={links.map(l => ({
            ...l,
            onClick: () => {
              setMapMainSettings({
                showAnalysis: l.showAnalysis,
                hideLegend:
                  (showAnalysis && l.active && !hidden) ||
                  (!showAnalysis && l.active && !hidden)
              });
              clearAnalysisError();
            }
          }))}
          checkActive
        />
        {!hidden &&
          !showAnalysis && (
            <div className="legend">
              <MapLegend />
            </div>
          )}
        {!hidden && showAnalysis && <Analysis className="analysis" analysis />}
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
  setMapMainSettings: PropTypes.func,
  clearAnalysisError: PropTypes.func,
  embed: PropTypes.bool
};

export default DataAnalysisMenu;
