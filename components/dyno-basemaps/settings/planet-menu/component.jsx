import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import Timeframe from 'components/ui/timeframe';

import './styles.scss';

export const PlanetMenu = ({
  periodOptions,
  periodSelected,
  onSelectBasemap,
  colorOptions,
  colorSelected,
}) => (
  <div className="c-planet-menu">
    <h6>period</h6>
    <Timeframe selected={periodSelected} periods={periodOptions} />
    <h6>image type</h6>
    <Dropdown
      theme="theme-dropdown-native theme-dropdown-native-button-green"
      value={colorSelected}
      options={colorOptions}
      onChange={(value) =>
        onSelectBasemap({
          value: 'planet',
          color: value,
        })}
      native
    />
  </div>
);

PlanetMenu.propTypes = {
  periodOptions: PropTypes.array,
  periodSelected: PropTypes.number,
  colorOptions: PropTypes.array,
  colorSelected: PropTypes.string,
  onSelectBasemap: PropTypes.func,
};

export default PlanetMenu;
