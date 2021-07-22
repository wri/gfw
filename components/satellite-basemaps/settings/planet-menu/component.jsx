import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import Timeframe from 'components/ui/timeframe';

import './styles.scss';

function periodsAsSelect(periods) {
  return periods.map((p) => ({ label: p.period, value: p.value }));
}

export const PlanetMenu = ({
  periodOptions,
  defaultPeriodOption,
  periodSelectedIndex,
  setMapBasemap,
  colorOptions,
  colorSelected,
}) => (
  <div className="c-planet-menu">
    <h6>
      period
      <Dropdown
        theme="theme-dropdown-native theme-dropdown-native-button-green theme-dropdown-native-inline-label"
        value={periodOptions[periodSelectedIndex].value}
        options={periodsAsSelect(periodOptions)}
        onChange={(value) => setMapBasemap({ name: value })}
        native
      />
    </h6>
    <Timeframe
      selected={periodSelectedIndex}
      periods={periodOptions}
      onChange={({ value }) => setMapBasemap({ name: value })}
    />
    <h6>image type</h6>
    <Dropdown
      theme="theme-dropdown-native theme-dropdown-native-button-green theme-dropdown-full-width"
      value={colorSelected}
      options={colorOptions}
      onChange={(color) =>
        setMapBasemap({ color, name: defaultPeriodOption?.value })}
      native
    />
  </div>
);

PlanetMenu.propTypes = {
  periodOptions: PropTypes.array,
  defaultPeriodOption: PropTypes.object,
  periodSelectedIndex: PropTypes.number,
  colorOptions: PropTypes.array,
  colorSelected: PropTypes.string,
  setMapBasemap: PropTypes.func,
};

export default PlanetMenu;
