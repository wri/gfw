import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import Dropdown from 'components/ui/dropdown';
import Switch from 'components/ui/switch';
import Datepicker from 'components/ui/datepicker';
import withTooltipEvt from 'components/ui/with-tooltip-evt';

class WidgetSettings extends PureComponent {
  static propTypes = {
    settingsConfig: PropTypes.array.isRequired,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
    proxy: PropTypes.bool,
    proxyOn: PropTypes.array,
    getTooltipContentProps: PropTypes.func.isRequired,
    toggleWidgetSettings: PropTypes.func,
  };

  renderOption = (option) => {
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
      clearable,
      minDate,
      maxDate,
    } = option;

    const { embed, proxy, proxyOn, toggleWidgetSettings } = this.props;

    const popperSettings = {
      ...(embed &&
        type === 'datepicker' && {
          popperPlacement: 'left-start',
        }),
    };

    const propagateChange = (change) => {
      if (proxy && proxyOn?.length) {
        const changeKey = Object.keys(change);
        if (proxyOn.some((r) => changeKey.includes(r))) {
          toggleWidgetSettings();
        }
      }
      handleChangeSettings(change);
    };

    switch (type) {
      case 'switch':
        return (
          <Switch
            className="widget-settings-selector"
            theme="theme-switch-light"
            label={label}
            value={value && value.value}
            options={options}
            onChange={(change) => propagateChange({ [key]: change })}
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
              onChange={(change) =>
                propagateChange({ [startKey]: change && change.value })}
              disabled={loading}
            />
            <span className="text-separator">to</span>
            <Dropdown
              theme="theme-dropdown-button"
              value={endValue}
              options={endOptions}
              onChange={(change) =>
                propagateChange({ [endKey]: change && change.value })}
              disabled={loading}
            />
          </div>
        );
      case 'baseline-select':
        return (
          options &&
          !!options.length && (
            <Dropdown
              className={cx('widget-settings-selector', type)}
              theme={cx('theme-select-light', {
                'theme-dropdown-button': type === 'mini-select',
              })}
              label={label}
              value={startValue}
              options={options}
              onChange={(change) =>
                propagateChange({ [startKey]: change && change.value })}
              disabled={loading}
              clearable={clearable}
              infoAction={metaKey ? () => handleShowInfo(metaKey) : null}
              optionsAction={handleShowInfo}
              optionsActionKey="metaKey"
              noSelectedValue={placeholder}
            />
          )
        );
      case 'compare-select':
        return (
          <div className={cx('widget-settings-selector', type)}>
            <span className="label">{label}</span>
            <Dropdown
              theme={cx('theme-select-light', {
                'theme-dropdown-button': type === 'mini-select',
              })}
              value={value}
              options={options}
              clearable={clearable}
              onChange={(change) =>
                propagateChange({ [key]: change && change.value })}
              noSelectedValue={placeholder}
            />
          </div>
        );
      case 'datepicker': {
        const loadingDatepicker = !startValue || !minDate || !maxDate;

        return (
          <div className={cx('widget-settings-selector', type)}>
            <div className="datepicker-selector">
              <div>
                <span className="label">From</span>
                <Datepicker
                  {...popperSettings}
                  loading={loadingDatepicker}
                  selected={new Date(startValue)}
                  onChange={(change) =>
                    propagateChange({
                      [startKey]: moment(change).format('YYYY-MM-DD'),
                    })}
                  minDate={new Date(minDate)}
                  maxDate={new Date(maxDate)}
                  isOutsideRange={(d) =>
                    d.isAfter(moment(maxDate)) || d.isBefore(moment(minDate))}
                />
              </div>
              <div>
                <span className="label">To</span>
                <Datepicker
                  {...popperSettings}
                  loading={loadingDatepicker}
                  selected={new Date(endValue)}
                  onChange={(change) =>
                    propagateChange({
                      [endKey]: moment(change).format('YYYY-MM-DD'),
                    })}
                  minDate={new Date(minDate)}
                  maxDate={new Date(maxDate)}
                  isOutsideRange={(d) =>
                    d.isAfter(moment(maxDate)) || d.isBefore(moment(minDate))}
                />
              </div>
            </div>
          </div>
        );
      }
      default:
        return (
          options &&
          !!options.length && (
            <Dropdown
              className={cx('widget-settings-selector', type)}
              theme={cx('theme-select-light', {
                'theme-dropdown-button': type === 'mini-select',
              })}
              label={label}
              value={value}
              options={options}
              onChange={(change) =>
                propagateChange({ [key]: change && change.value })}
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
      getTooltipContentProps,
    } = this.props;

    return (
      <div className="c-widget-settings" {...getTooltipContentProps()}>
        {settingsConfig &&
          settingsConfig.map(
            (option) =>
              ((option.options && !!option.options.length) ||
                option.type === 'datepicker') && (
                <div
                  key={option.key}
                  className={cx('settings-option', { border: option.border })}
                >
                  {this.renderOption({
                    ...option,
                    loading,
                    handleChangeSettings,
                    handleShowInfo,
                  })}
                </div>
              )
          )}
      </div>
    );
  }
}

export default withTooltipEvt(WidgetSettings);
