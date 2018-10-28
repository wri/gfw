import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import startCase from 'lodash/startCase';
import { track } from 'utils/analytics';

import MenuTile from '../menu-tile';

import './styles.scss';

class MenuDesktop extends PureComponent {
  render() {
    const {
      className,
      datasetSections,
      searchSections,
      setMenuSettings
    } = this.props;

    return (
      <div className={cx('c-menu-desktop', className)}>
        <ul className="datasets-menu">
          {datasetSections &&
            datasetSections.filter(s => !s.hiddenMobile).map(s => (
              <MenuTile
                className="datasets-tile"
                key={`${s.slug}_${s.category}`}
                {...s}
                label={startCase(s.category)}
                onClick={() => {
                  setMenuSettings({
                    datasetCategory: s.active ? '' : s.category,
                    menuSection: s.active ? '' : s.slug
                  });
                  if (!s.active) {
                    track('mapMenuSection', { label: s.slug });
                  }
                }}
              />
            ))}
        </ul>
        <ul className="datasets-menu">
          {searchSections &&
            searchSections.map(s => (
              <MenuTile
                className="search-tile"
                key={s.slug}
                onClick={() => {
                  setMenuSettings({
                    menuSection: s.active ? '' : s.slug,
                    datasetCategory: ''
                  });
                  if (!s.active) {
                    track('mapMenuSection', { label: s.slug });
                  }
                }}
                {...s}
              />
            ))}
        </ul>
      </div>
    );
  }
}

MenuDesktop.propTypes = {
  datasetSections: PropTypes.array,
  searchSections: PropTypes.array,
  setMenuSettings: PropTypes.func,
  className: PropTypes.string
};

export default MenuDesktop;
