import cx from 'classnames';
import PropTypes from 'prop-types';

import './styles.scss';

export const LandsatMenu = ({
  selectBasemap,
  activeBasemap,
  landsatYears,
  basemaps,
  isDesktop,
}) => {
  const year = activeBasemap.year || landsatYears[0].value;
  const basemap = basemaps[item.value]
    ? basemaps[item.value]
    : basemaps.landsat;

  return (
    <button
      className="c-landsat-menu"
      onClick={() => {
        selectBasemap({
          value: 'landsat',
          year: basemap.defaultYear,
        });
        if (!isDesktop) {
          this.setState({ showBasemaps: !this.state.showBasemaps });
        }
      }}
    >
      <div
        className="basemaps-list-item-image"
        style={{
          backgroundImage: `url(${item.image})`,
        }}
      />
      <span
        className="basemaps-list-item-name"
        onClick={(e) => e.stopPropagation()}
      >
        {item.label}
        <div className="basemaps-list-item-selectors">
          <Dropdown
            className="landsat-selector"
            theme="theme-dropdown-native-inline"
            value={year}
            options={landsatYears}
            onChange={(value) => {
              const selectedYear = parseInt(value, 10);
              selectBasemap({
                value: 'landsat',
                year: selectedYear,
              });
              if (!isDesktop) {
                this.setState({ showBasemaps: !this.state.showBasemaps });
              }
            }}
            native
          />
        </div>
      </span>
    </button>
  )
}

LandsatMenu.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}

export default LandsatMenu;