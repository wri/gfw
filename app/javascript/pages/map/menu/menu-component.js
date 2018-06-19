import React, { PureComponent } from 'react';

import Icon from 'components/ui/icon';

import arrowIcon from 'assets/icons/flechita.svg';
import gfwLogo from 'assets/logos/gfw.png';
import ForestChange from './components/forest-change';

import './menu-styles.scss';

class Menu extends PureComponent {
  render() {
    return (
      <div className="c-map-menu">
        <img
          className="c-map-menu__logo"
          src={gfwLogo}
          alt="Global Forest Watch"
        />
        <div className="c-map-menu__buttons-group">
          <ul>
            <li className="c-map-menu__item">
              <button className="c-map-menu__item-button" onClick={() => {}}>
                <Icon icon={arrowIcon} className="icon" />
                FOREST CHANGE
              </button>
            </li>
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
          </ul>
          <ul>
            <li className="c-map-menu__item" />
            <li className="c-map-menu__item" />
          </ul>
        </div>
        <div className="c-map-menu__item-flap">
          <ForestChange />
        </div>
      </div>
    );
  }
}

export default Menu;
