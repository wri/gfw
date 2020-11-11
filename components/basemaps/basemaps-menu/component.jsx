import PropTypes from 'prop-types';

import { Row, Column, Desktop } from 'gfw-components';

import BasemapButton from '../basemap-button';
import LandsatMenu from '../landsat-menu';
import PlanetMenu from '../planet-menu';

import './styles.scss';

export const BasemapsMenu = ({ basemaps, activeBasemap, onSelectBasemap }) => (
  <div className="c-basemaps-menu">
    <Row>
      <Column>
        <Desktop>
          <h4>Map styles</h4>
        </Desktop>
      </Column>
      {Object.values(basemaps).map((item) => (
        <Column key={item.value} width={[1 / 3]} className="btn-col">
          <BasemapButton
            {...item}
            active={activeBasemap?.value === item?.value}
            onSelectBasemap={onSelectBasemap}
          />
        </Column>
      ))}
      {activeBasemap?.value === 'landsat' && (
        <div className="basemap-submenu -landsat">
          <Column>
            <LandsatMenu {...activeBasemap} onSelectBasemap={onSelectBasemap} />
          </Column>
        </div>
      )}
      {activeBasemap?.value === 'planet' && (
        <div className="basemap-submenu -planet">
          <Column>
            <PlanetMenu {...activeBasemap} onSelectBasemap={onSelectBasemap} />
          </Column>
        </div>
      )}
    </Row>
  </div>
);

BasemapsMenu.propTypes = {
  basemaps: PropTypes.object,
  activeBasemap: PropTypes.object,
  onSelectBasemap: PropTypes.func,
};

export default BasemapsMenu;
