import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Dropdown from 'components/ui/dropdown';
import Switch from 'components/ui/switch';
import withTooltipEvt from 'components/ui/with-tooltip-evt';

import './styles.scss';

class WidgetSettings extends PureComponent {
  static propTypes = {
    type: PropTypes.array.isRequired,
    label: PropTypes.array,
    options: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    metakey: PropTypes.string,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    placeholder: PropTypes.string,
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
    metakey: '',
    border: false
  }

  renderSettingsSelector = props => {
    const { type, label, options, value, metakey, handleShowInfo, handleChangeSettings, loading, placeholder } = props;

    if (options.length <= 1) return null;
    if (options.length === 2) {
      return (<Switch
        className="widget-settings-switch"
        theme="theme-switch-light"
        label={label}
        value={value}
        options={options}
        onChange={handleChangeSettings}
        disabled={loading}
      />);
    }

    return options && !!options.length && (
      <Dropdown
        className={cx('widget-settings-selector', { 'mini-selector': type === 'mini-selector' })}
        theme="theme-select-light"
        label={label}
        value={value}
        options={options}
        onChange={handleChangeSettings}
        disabled={loading}
        infoAction={() => handleShowInfo(metakey)}
        optionsAction={handleShowInfo}
        optionsActionKey="metaKey"
        noSelectedValue={placeholder}
      />
    );
  }

  renderDoubleSelector = props => {
    const { label, options, value, metakey, handleShowInfo, handleChangeSettings, loading, placeholder } = props;


    return (
      <div className="widget-double-selector">
        <span>{label}</span>
        <Dropdown
          className="widget-settings-selector"
          theme="theme-dropdown-button"
          value={value}
          options={options}
          onChange={handleChangeSettings}
          disabled={loading}
          infoAction={() => handleShowInfo(metakey)}
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
          onChange={handleChangeSettings}
          disabled={loading}
          infoAction={() => handleShowInfo(metakey)}
          optionsAction={handleShowInfo}
          optionsActionKey="metaKey"
          noSelectedValue={placeholder}
        />
      </div>
    );
  }

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
        {options && options.map(option => {
          const { type } = option;
          const settingParams = { loading, handleChangeSettings, handleShowInfo, ...option };

          if (type === 'selector' || type === 'mini-selector') {
            return this.renderSettingsSelector(settingParams);
          } else if (type === 'double-selector') {
            return this.renderDoubleSelector(settingParams);
          }

          return false;
        })}
      </div>
    );
  }
}

export default withTooltipEvt(WidgetSettings);
