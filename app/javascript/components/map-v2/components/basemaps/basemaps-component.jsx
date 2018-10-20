/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import closeIcon from 'assets/icons/close.svg';

import './styles.scss';

class Basemaps extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    boundaries: PropTypes.array,
    basemaps: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    landsatYears: PropTypes.array.isRequired,
    selectLabels: PropTypes.func.isRequired,
    selectBasemap: PropTypes.func.isRequired,
    activeLabels: PropTypes.object.isRequired,
    activeBasemap: PropTypes.object.isRequired,
    selectBoundaries: PropTypes.func.isRequired,
    activeBoundaries: PropTypes.object,
    isDesktop: PropTypes.bool,
    getTooltipContentProps: PropTypes.func.isRequired
  };

  onLabelsChange = selected => {
    this.props.selectLabels(selected);
  };

  onLansatChange = year => {
    const { basemaps, selectBasemap } = this.props;
    selectBasemap(basemaps.landsat, year);
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
    const { selectBasemap, activeBasemap, landsatYears, basemaps } = this.props;
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
            onChange={value => this.onLansatChange(parseInt(value, 10))}
            native
          />
        </span>
      </button>
    );
  }

  render() {
    const {
      onClose,
      activeLabels,
      activeBasemap,
      getTooltipContentProps,
      activeBoundaries,
      selectBoundaries,
      boundaries,
      basemaps,
      labels,
      isDesktop
    } = this.props;

    const selectedBoundaries = activeBoundaries
      ? { label: activeBoundaries.name }
      : boundaries && boundaries[0];
    return (
      <div className="c-basemaps" {...getTooltipContentProps()}>
        <div className="basemaps-top-section">
          {isDesktop && (
            <div className="basemaps-header">
              <h2 className="basemaps-title">Basemap Options</h2>
              <div className="basemaps-actions">
                <button className="basemaps-action-button" onClick={onClose}>
                  <Icon icon={closeIcon} />
                </button>
              </div>
            </div>
          )}
          <ul className="basemaps-options-container">
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="boundaries"
                value={selectedBoundaries}
                options={boundaries}
                onChange={selectBoundaries}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="labels"
                value={activeLabels}
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
