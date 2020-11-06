import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

export const LandsatMenu = ({
  year,
  defaultYear,
  availableYears,
  onSelectBasemap,
}) => (
  <div className="c-landsat-menu">
    <h6>period</h6>
    <Dropdown
      className="landsat-selector"
      theme="theme-dropdown-native theme-dropdown-native-button-green"
      value={year || defaultYear}
      options={availableYears?.map((y) => ({ label: y, value: y }))}
      onChange={(value) =>
        onSelectBasemap({
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
  availableYears: PropTypes.array,
  onSelectBasemap: PropTypes.func,
};

export default LandsatMenu;
