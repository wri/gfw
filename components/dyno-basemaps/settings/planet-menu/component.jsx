import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import Timeframe from 'components/ui/timeframe';

import './styles.scss';

export const PlanetMenu = ({
  periodOptions,
  periodSelectedIndex,
  setMapBasemap,
  colorOptions,
  colorSelected,
}) => (
  <div className="c-planet-menu">
    <h6>period</h6>
    <Timeframe
      selected={periodSelectedIndex}
      periods={periodOptions}
      onChange={({ value }) => setMapBasemap({ name: value })}
    />
    <h6>image type</h6>
    <Dropdown
      theme="theme-dropdown-native theme-dropdown-native-button-green"
      value={colorSelected}
      options={colorOptions}
      onChange={(color) => setMapBasemap({ color })}
      native
    />
  </div>
);

PlanetMenu.propTypes = {
  periodOptions: PropTypes.array,
  periodSelectedIndex: PropTypes.number,
  colorOptions: PropTypes.array,
  colorSelected: PropTypes.string,
  setMapBasemap: PropTypes.func,
};

export default PlanetMenu;
