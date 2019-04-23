/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import closeIcon from 'assets/icons/close.svg';
import infoIcon from 'assets/icons/info.svg';

import boundariesIcon from 'assets/icons/boundaries.svg';
import labelsIcon from 'assets/icons/labels.svg';
// import roadsIcon from 'assets/icons/roads.svg';

import './styles.scss';

class Basemaps extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showBasemaps: false };
  }

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
    setModalMetaSettings: PropTypes.func
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

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(basemaps.landsat, year)}
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
          <Dropdown
            className="landsat-selector"
            theme="theme-dropdown-native-inline"
            value={year}
            options={landsatYears}
            onChange={value =>
              selectBasemap(basemaps.landsat, parseInt(value, 10))
            }
            native
          />
        </span>
      </button>
    );
  }

  renderBasemapsSelector() {
    const { activeBasemap, basemaps } = this.props;
    return (
      <div className="basemaps-bottom-section">
        <div className="basemap-list-scroll-wrapper">
          <ul className="basemaps-list">
            {Object.values(basemaps).map(item => (
              <li
                key={item.value}
                className={cx('basemaps-list-item', {
                  '-active': activeBasemap.value === item.value
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
              <h2 className="basemaps-title">Map settings</h2>
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
            {!isDesktop && (
              <li className="basemaps-options-wrapper">
                <Button
                  theme="theme-button-dark-round"
                  background={`url(${activeBasemap.image})`}
                  onClick={() =>
                    this.setState({ showBasemaps: !this.state.showBasemaps })
                  }
                >
                  <span className="value">{activeBasemap.label}</span>
                </Button>
              </li>
            )}
            <li className="basemaps-options-wrapper">
              <Dropdown
                theme={cx('theme-dropdown-button', {
                  'theme-dropdown-dark-round theme-dropdown-no-border': !isDesktop,
                  'theme-dropdown-dark-squared': isDesktop
                })}
                value={selectedBoundaries}
                options={boundaries}
                onChange={selectBoundaries}
                selectorIcon={boundariesIcon}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                theme={cx('theme-dropdown-button', {
                  'theme-dropdown-dark-round theme-dropdown-no-border': !isDesktop,
                  'theme-dropdown-dark-squared': isDesktop
                })}
                value={activeLabels}
                options={Object.values(labels)}
                onChange={this.props.selectLabels}
                selectorIcon={labelsIcon}
              />
            </li>
          </ul>
        </div>
        {(isDesktop || this.state.showBasemaps) &&
          this.renderBasemapsSelector()}
      </div>
    );
  }
}

export default Basemaps;
