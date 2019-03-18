/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Switch from 'components/ui/switch';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import closeIcon from 'assets/icons/close.svg';
import moment from 'moment';
import infoIcon from 'assets/icons/info.svg';

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
    getTooltipContentProps: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func,
    setMapSettings: PropTypes.func
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
            backgroundImage: `url(${item.image})`
          }}
        />
        <p className="basemaps-list-item-name">{item.label}</p>
      </button>
    );
  }

  renderDropdownBasemap(item) {
    const { selectBasemap, activeBasemap, landsatYears, basemaps } = this.props;
    const year = activeBasemap.year || landsatYears[0].value;
    const basemap = basemaps[item.value]
      ? basemaps[item.value]
      : basemaps.landsat;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(basemap, year)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Dropdown
              className="landsat-selector"
              theme="theme-dropdown-native-inline"
              value={year}
              options={landsatYears}
              onChange={value => selectBasemap(basemap, parseInt(value, 10))}
              native
            />
          </div>
        </span>
      </button>
    );
  }

  renderTooltipBasemap(item) {
    const { selectBasemap, activeBasemap, basemaps } = this.props;
    const basemap = basemaps[item.value]
      ? basemaps[item.value]
      : basemaps.planet;
    const years = [2016, 2017, 2018].map(y => ({ value: y, label: y }));
    const year = activeBasemap.year || 2018;
    const month = parseInt(activeBasemap.month, 10) || 1;
    const frequency = activeBasemap.frequency || 'monthly';
    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(basemap, year, month)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Tooltip
              className="basemaps-tooltip"
              theme="light"
              interactive
              arrow
              sticky
              useContext
              html={this.renderTooltipWindow({
                month,
                year,
                years,
                frequency,
                onDateChange: (m, y) => selectBasemap(basemap, m, y)
              })}
              open
            >
              <span>{`${`0${month}`.slice(-2)}/${year}`}</span>
            </Tooltip>
          </div>
        </span>
      </button>
    );
  }

  renderTooltipWindow(options) {
    const { month, year, years, frequency, onDateChange } = options;
    const { setMapSettings } = this.props;
    const months = moment
      .months()
      .map((m, i) => ({ value: i, label: `0${i + 1}`.slice(-2) }));
    const Qs = ['Q1', 'Q2', 'Q3', 'Q4'].map(y => ({ value: y, label: y }));
    return (
      <div className="c-basemaps-tooltip">
        <Switch
          theme="theme-switch-light"
          label="FREQUENCY"
          value={frequency}
          options={[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' }
          ]}
          onChange={option => {
            setMapSettings({ basemap: { frequency: option } });
          }}
        />
        <div className="years-select">
          <span className="label">PERIOD</span>
          <div className="select-container">
            <Dropdown
              className="years-dropdown"
              theme="theme-dropdown-button"
              value={month - 1}
              options={frequency === 'monthly' ? months : Qs}
              onChange={m => {
                onDateChange(year, `0${parseInt(m, 10) + 1}`.slice(-2));
              }}
              native
            />
            <span className="text-date">/</span>
            <Dropdown
              theme="theme-dropdown-button"
              value={year}
              options={years}
              onChange={y => {
                onDateChange(y, month);
              }}
              native
            />
          </div>
        </div>
      </div>
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
      isDesktop,
      setModalMetaSettings
    } = this.props;

    const selectedBoundaries = activeBoundaries
      ? { label: activeBoundaries.name }
      : boundaries && boundaries[0];
    return (
      <div
        className={cx('c-basemaps', 'map-tour-basemaps')}
        {...getTooltipContentProps()}
      >
        <div className="basemaps-top-section">
          {isDesktop && (
            <div className="basemaps-header">
              <h2 className="basemaps-title">Basemap Options</h2>
              <div className="basemaps-actions">
                <Button
                  className="info-btn"
                  theme="theme-button-tiny theme-button-grey-filled square"
                  onClick={() =>
                    setModalMetaSettings({ metakey: 'flagship_basemaps' })
                  }
                >
                  <Icon icon={infoIcon} />
                </Button>
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
                onChange={this.props.selectLabels}
              />
            </li>
          </ul>
        </div>
        <div className="basemaps-bottom-section">
          <div className="basemap-list-scroll-wrapper">
            <ul className="basemaps-list">
              {Object.values(basemaps).map(item => {
                let basemapButton;
                if (item.dynamic) {
                  basemapButton = this.renderDropdownBasemap(item);
                } else if (item.tooltip) {
                  basemapButton = this.renderTooltipBasemap(item);
                } else {
                  basemapButton = this.renderButtonBasemap(item);
                }
                return (
                  <li
                    key={item.value}
                    className={cx('basemaps-list-item', {
                      '-active': activeBasemap.value === item.value
                    })}
                  >
                    {basemapButton}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Basemaps;
