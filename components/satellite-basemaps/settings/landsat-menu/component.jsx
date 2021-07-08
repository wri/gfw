import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

export const LandsatMenu = ({
  year,
  defaultYear,
  availableYears,
  setMapBasemap
}) => (
  <div className="c-planet-menu">
    <h6>period</h6>
    <Dropdown
      className="landsat-selector"
      theme="theme-dropdown-native theme-dropdown-native-button-green theme-dropdown-full-width"
      value={year || defaultYear}
      options={availableYears}
      onChange={(value) =>
        setMapBasemap({
          value: 'landsat',
          year: parseInt(value, 10),
        })}
      native
    />
  </div>
);

LandsatMenu.propTypes = {
  year: PropTypes.number,
  defaultYear: PropTypes.number,
  availableYears: PropTypes.arrayOf(PropTypes.object),
  setMapBasemap: PropTypes.func,
};

export default LandsatMenu;
