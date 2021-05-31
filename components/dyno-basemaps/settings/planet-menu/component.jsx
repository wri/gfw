import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

export const PlanetMenu = ({
  periodOptions,
  periodSelected,
  onSelectBasemap,
  colorOptions,
  colorSelected,
}) => (
  <div className="c-planet-menu">
    {/* <Column width={[6.5 / 12]}>
      <h6>period</h6>
      <Dropdown
        className="landsat-selector"
        theme="theme-dropdown-native theme-dropdown-native-button-green"
        value={periodSelected?.value}
        options={periodOptions}
        onChange={(value) =>
          onSelectBasemap({
            value: 'planet',
            name: value,
            color: colorSelected,
          })}
        native
      />
    </Column> */}
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
  periodSelected: PropTypes.object,
  colorOptions: PropTypes.array,
  colorSelected: PropTypes.string,
  onSelectBasemap: PropTypes.func,
};

export default PlanetMenu;
