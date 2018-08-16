import React from 'react';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';
import infoIcon from 'assets/icons/info.svg';

import schema from './basemaps-schema';
import './styles.scss';

class Basemaps extends React.PureComponent {
  state = {
    items: [{ label: 'Admin', value: 0 }, { label: 'Admin1', value: 1 }],
    value: 0
  };

  render() {
    const selected = 'default';
    return (
      <div className="c-basemaps">
        <div className="basemaps-top-section">
          <div className="basemaps-header">
            <h2 className="basemaps-title">Basemap Options</h2>
            <div className="basemaps-actions">
              <button className="basemaps-action-button">
                <Icon icon={infoIcon} />
              </button>
              <button className="basemaps-action-button">
                <Icon icon={closeIcon} />
              </button>
            </div>
          </div>
          <ul className="basemaps-options-container">
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="boundaries"
                value={this.state.value}
                options={this.state.items}
                onChange={value => this.setState({ value })}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="labels"
                value={this.state.value}
                options={this.state.items}
              />
            </li>
          </ul>
        </div>
        <div className="basemaps-bottom-section">
          <div className="basemap-list-scroll-wrapper">
            <ul className="basemaps-list">
              {Object.values(schema).map(item => (
                <li
                  key={item.id}
                  className={cx('basemaps-list-item', {
                    '-active': selected === item.id
                  })}
                >
                  <div
                    className="basemaps-list-item-image"
                    style={{
                      backgroundImage: `url(/assets/basemaps/${item.id}.png)`
                    }}
                  />
                  <p className="basemaps-list-item-name">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Basemaps;
