import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import MapLegend from 'components/map-v2/components/legend';
import Analysis from 'components/map-v2/components/analysis';
import SubNavMenu from 'components/subnav-menu';

import './styles.scss';

class DataAnalysisMenu extends PureComponent {
  render() {
    const {
      className,
      showAnalysis,
      menuSection,
      links,
      setAnalysisSettings,
      clearAnalysisError,
      hidden
    } = this.props;

    return (
      <div
        className={cx(
          'c-data-analysis-menu',
          { '-relocate': !!menuSection },
          { '-big': menuSection && menuSection.large },
          className
        )}
      >
        <SubNavMenu
          className="nav"
          theme="theme-subnav-plain"
          links={links.map(l => ({
            ...l,
            onClick: () => {
              setAnalysisSettings({
                showAnalysis: l.showAnalysis,
                hidden:
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
        {!hidden && showAnalysis && <Analysis className="analysis" />}
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
  setAnalysisSettings: PropTypes.func,
  clearAnalysisError: PropTypes.func
};

export default DataAnalysisMenu;
