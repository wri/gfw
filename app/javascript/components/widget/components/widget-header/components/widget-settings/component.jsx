import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Switch from 'components/ui/switch';
import withTooltipEvt from 'components/ui/with-tooltip-evt';

import './styles.scss';

class WidgetSettings extends PureComponent {
  static propTypes = {
    settingsConfig: PropTypes.array.isRequired,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    getTooltipContentProps: PropTypes.func.isRequired
  };

  renderOption = option => {
    const {
      type,
      label,
      options,
      startOptions,
      endOptions,
      key,
      startKey,
      endKey,
      value,
      startValue,
      endValue,
      metaKey,
      handleShowInfo,
      handleChangeSettings,
      loading,
      placeholder,
      clearable
    } = option;

    switch (type) {
      case 'switch':
        return (
          <Switch
            className="widget-settings-selector"
            theme="theme-switch-light"
            label={label}
            value={value && value.value}
            options={options}
            onChange={change => handleChangeSettings({ [key]: change })}
            disabled={loading}
          />
        );
      case 'range-select':
        return (
          <div className={cx('widget-settings-selector', type)}>
            <span className="label">{label}</span>
            <Dropdown
              theme="theme-dropdown-button"
              value={startValue}
              options={startOptions}
              onChange={change =>
                handleChangeSettings({ [startKey]: change && change.value })
              }
              disabled={loading}
            />
            <span className="text-separator">to</span>
            <Dropdown
              theme="theme-dropdown-button"
              value={endValue}
              options={endOptions}
              onChange={change =>
                handleChangeSettings({ [endKey]: change && change.value })
              }
              disabled={loading}
            />
          </div>
        );

      case 'compare-select':
        return (
          <div className={cx('widget-settings-selector', type)}>
            <span className="label">{label}</span>

            <Dropdown
              theme={cx('theme-select-light', {
                'theme-dropdown-button': type === 'mini-select'
              })}
              value={value}
              options={options}
              clearable={clearable}
              onChange={change =>
                handleChangeSettings({ [key]: change && change.value })
              }
            />
          </div>
        );

      default:
        return (
          options &&
          !!options.length && (
            <Dropdown
              className={cx('widget-settings-selector', type)}
              theme={cx('theme-select-light', {
                'theme-dropdown-button': type === 'mini-select'
              })}
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
    }
  };

  render() {
    const {
      settingsConfig,
      loading,
      handleChangeSettings,
      handleShowInfo,
      getTooltipContentProps
    } = this.props;

    return (
      <div className="c-widget-settings" {...getTooltipContentProps()}>
        {settingsConfig &&
          settingsConfig.map(
            option =>
              option.options &&
              !!option.options.length && (
                <div
                  key={option.key}
                  className={cx('settings-option', { border: option.border })}
                >
                  {this.renderOption({
                    ...option,
                    loading,
                    handleChangeSettings,
                    handleShowInfo
                  })}
                </div>
              )
          )}
      </div>
    );
  }
}

export default withTooltipEvt(WidgetSettings);
