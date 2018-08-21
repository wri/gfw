/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';
import infoIcon from 'assets/icons/info.svg';

import basemaps, { labels } from './basemaps-schema';
import './styles.scss';

class Basemaps extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    fowardedRef: PropTypes.any,
    activeBasemap: PropTypes.object.isRequired,
    selectBasemap: PropTypes.func.isRequired,
    selectLabels: PropTypes.func.isRequired,
    activeLabels: PropTypes.object.isRequired
  };

  state = {
    labels: this.props.activeLabels,
    landsatYears: basemaps.landsat.availableYears.map(y => ({
      label: y,
      value: y
    }))
  };

  onLabelsChange = selected => {
    this.setState({ labels: selected });
    this.props.selectLabels(selected);
  };

  onLansatChange = e => {
    const activeLandsatYear = parseInt(e.currentTarget.value, 10);
    this.props.selectBasemap(basemaps.landsat, activeLandsatYear);
  };

  renderButtonBasemap(item) {
    const { selectBasemap } = this.props;
    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(item)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(/assets/basemaps/${item.id}.png)`
          }}
        />
        <p className="basemaps-list-item-name">{item.label}</p>
      </button>
    );
  }

  renderDropdownBasemap(item) {
    const { selectBasemap, activeBasemap } = this.props;
    const { landsatYears } = this.state;
    const year = activeBasemap.year || landsatYears[0].value;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(basemaps.landsat, year)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(/assets/basemaps/${item.id}.png)`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <Dropdown
            className="theme-dropdown-native-inline"
            value={year}
            options={landsatYears}
            native
            onChange={this.onLansatChange}
          />
        </span>
      </button>
    );
  }

  render() {
    const { onClose, fowardedRef, activeBasemap } = this.props;
    return (
      <div className="c-basemaps" ref={fowardedRef}>
        <div className="basemaps-top-section">
          <div className="basemaps-header">
            <h2 className="basemaps-title">Basemap Options</h2>
            <div className="basemaps-actions">
              {false && (
                <button className="basemaps-action-button">
                  <Icon icon={infoIcon} />
                </button>
              )}
              <button className="basemaps-action-button" onClick={onClose}>
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
                value={this.state.labels}
                options={Object.values(labels)}
                onChange={this.onLabelsChange}
              />
            </li>
          </ul>
        </div>
        <div className="basemaps-bottom-section">
          <div className="basemap-list-scroll-wrapper">
            <ul className="basemaps-list">
              {Object.values(basemaps).map(item => (
                <li
                  key={item.id}
                  className={cx('basemaps-list-item', {
                    '-active': activeBasemap.id === item.id
                  })}
                >
                  {item.dynamic
                    ? this.renderDropdownBasemap(item)
                    : this.renderButtonBasemap(item)}
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
