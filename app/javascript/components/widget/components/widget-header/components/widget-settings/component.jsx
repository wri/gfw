import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Switch from 'components/ui/switch';
import withTooltipEvt from 'components/ui/with-tooltip-evt';

import './styles.scss';

class WidgetSettings extends PureComponent {
  static propTypes = {
    options: PropTypes.array.isRequired,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    getTooltipContentProps: PropTypes.func.isRequired
  };

  config = {
    label: 'UNIT',
    key: 'forestChange',
    options: [],
    value: {} || '',
    type: 'selector' || 'multiselector' || 'mini-selector',
    clearable: false,
    handleChangeSettings: '',
    placeholder: '',
    metaKey: '',
    border: false
  };

  renderSettingsSelector = option => {
    const {
      type,
      label,
      options,
      key,
      value,
      metaKey,
      handleShowInfo,
      handleChangeSettings,
      loading,
      placeholder,
      clearable
    } = option;

    if (type === 'switch') {
      return (
        <Switch
          className="widget-settings-switch"
          theme="theme-switch-light"
          label={label}
          value={value}
          options={options}
          onChange={change => handleChangeSettings({ [key]: change.value })}
          disabled={loading}
        />
      );
    }

    return (
      options &&
      !!options.length && (
        <Dropdown
          className={cx('widget-settings-selector', type)}
          theme="theme-select-light"
          label={label}
          value={value}
          options={options}
          onChange={change =>
            handleChangeSettings({ [key]: change && change.value })
          }
          disabled={loading}
          clearable={clearable}
          infoAction={metaKey ? () => handleShowInfo(metaKey) : null}
          optionsAction={handleShowInfo}
          optionsActionKey="metaKey"
          noSelectedValue={placeholder}
        />
      )
    );
  };

  renderDoubleSelector = option => {
    const {
      label,
      options,
      key,
      value,
      metaKey,
      handleShowInfo,
      handleChangeSettings,
      loading,
      placeholder
    } = option;

    return (
      <div className="widget-double-selector">
        <span>{label}</span>
        <Dropdown
          className="widget-settings-selector"
          theme="theme-dropdown-button"
          value={value}
          options={options}
          onChange={change =>
            handleChangeSettings({ [key]: change && change.value })
          }
          disabled={loading}
          infoAction={() => handleShowInfo(metaKey)}
          optionsAction={handleShowInfo}
          optionsActionKey="metaKey"
          noSelectedValue={placeholder}
        />
        <span className="text-separator">to</span>
        <Dropdown
          className="widget-settings-selector"
          theme="theme-dropdown-button"
          value={value}
          options={options}
          onChange={change =>
            handleChangeSettings({ [key]: change && change.value })
          }
          disabled={loading}
          infoAction={() => handleShowInfo(metaKey)}
          optionsAction={handleShowInfo}
          optionsActionKey="metaKey"
          noSelectedValue={placeholder}
        />
      </div>
    );
  };

  render() {
    const {
      options,
      loading,
      handleChangeSettings,
      handleShowInfo,
      getTooltipContentProps
    } = this.props;

    return (
      <div className="c-widget-settings" {...getTooltipContentProps()}>
        {options &&
          options.map(option => {
            const { type, border, key } = option;
            const settingParams = {
              loading,
              handleChangeSettings,
              handleShowInfo,
              ...option
            };
            let Component = null;
            if (type === 'selector' || type === 'mini-selector') {
              Component = this.renderSettingsSelector(settingParams);
            } else if (type === 'double-selector') {
              Component = this.renderDoubleSelector(settingParams);
            }

            return (
              <div
                key={key}
                className={cx('settings-option', { border })}
              >
                {Component}
              </div>
            );
          })}
      </div>
    );
  }
}

export default withTooltipEvt(WidgetSettings);
