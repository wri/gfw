import PropTypes from 'prop-types';

import { Row, Column } from 'gfw-components';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

export const PlanetMenu = ({
  name,
  rangeOptions,
  rangeSelected,
  periodOptions,
  periodSelected,
  onSelectBasemap,
  colorOptions,
  colorSelected,
}) => (
  <div className="c-landsat-menu">
    <Row nested className="menu-row">
      <Column width={[5 / 12]}>
        <h6>range</h6>
        <Dropdown
          className="landsat-selector"
          theme="theme-dropdown-native theme-dropdown-native-button-green"
          value={rangeSelected?.value}
          options={rangeOptions}
          onChange={(value) =>
            onSelectBasemap({
              value: 'planet',
              name: value,
              color: colorSelected,
            })}
          native
        />
      </Column>
      <Column width={[7 / 12]}>
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
      </Column>
    </Row>
    <Row nested>
      <Column>
        <h6>band</h6>
        <Dropdown
          className="landsat-selector"
          theme="theme-dropdown-native theme-dropdown-native-button-green"
          value={colorSelected}
          options={colorOptions}
          onChange={(value) =>
            onSelectBasemap({
              value: 'planet',
              name,
              color: value,
            })}
          native
        />
      </Column>
    </Row>
  </div>
);

PlanetMenu.propTypes = {
  name: PropTypes.string,
  rangeOptions: PropTypes.array,
  rangeSelected: PropTypes.object,
  periodOptions: PropTypes.array,
  periodSelected: PropTypes.object,
  colorOptions: PropTypes.array,
  colorSelected: PropTypes.string,
  onSelectBasemap: PropTypes.func,
};

export default PlanetMenu;
