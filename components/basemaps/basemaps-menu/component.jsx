import PropTypes from 'prop-types';

import { Row, Column } from 'gfw-components';

import BasemapButton from '../basemap-button';

import './styles.scss';

export const BasemapsMenu = ({ basemaps, activeBasemap, onSelectBasemap }) => (
  <div className="c-basemaps-menu">
    <Row>
      {Object.values(basemaps).map((item) => (
        <Column key={item.value} width={[1 / 3]} className="btn-col">
          <BasemapButton {...item} active={activeBasemap === item?.value} onClick={onSelectBasemap} />
        </Column>
      ))}
    </Row>
  </div>
)

BasemapsMenu.propTypes = {
  basemaps: PropTypes.object,
  activeBasemap: PropTypes.object,
  onSelectBasemap: PropTypes.func,
}

export default BasemapsMenu;