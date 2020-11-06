import PropTypes from 'prop-types';

import { Row, Column } from 'gfw-components';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

export const LandsatMenu = ({
  year,
  defaultYear,
  availableYears,
  onSelectBasemap,
}) => (
  <div className="c-landsat-menu">
    <Row nested className="menu-row">
      <Column width={[1 / 3]}>
        <h6>range</h6>
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
      </Column>
      <Column width={[2 / 3]}>
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
      </Column>
    </Row>
    <Row nested>
      <Column>
        <h6>band</h6>
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
      </Column>
    </Row>
  </div>
);

LandsatMenu.propTypes = {
  year: PropTypes.number,
  defaultYear: PropTypes.number,
  availableYears: PropTypes.array,
  onSelectBasemap: PropTypes.func,
};

export default LandsatMenu;
