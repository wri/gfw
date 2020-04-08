import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';
import { track } from 'app/analytics';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import settingsIcon from 'assets/icons/settings.svg';
import WidgetSettings from '../widget-settings';

import './styles.scss';

class WidgetSettingsButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    settingsConfig: PropTypes.array,
    loading: PropTypes.bool,
    active: PropTypes.bool,
    preventCloseSettings: PropTypes.bool,
    handleChangeSettings: PropTypes.func.isRequired,
    handleShowInfo: PropTypes.func.isRequired
  };

  state = {
    tooltipOpen: false
  };

  render() {
    const {
      settingsConfig,
      loading,
      preventCloseSettings,
      handleChangeSettings,
      handleShowInfo,
      title,
      active
    } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <Tooltip
        className={cx('c-widget-settings-button', {
          'widget-settings-btn-active': active
        })}
        theme="widget-tooltip-theme light"
        position="bottom-right"
        offset={-95}
        trigger="click"
        interactive
        onRequestClose={() => {
          const isTargetOnTooltip = isParent(
            this.widgetSettingsRef,
            this.widgetSettingsRef.evt
          );
          this.widgetSettingsRef.clearEvt();
          if (!preventCloseSettings && !isTargetOnTooltip) {
            this.setState({ tooltipOpen: false });
          }
        }}
        onShow={() => {
          this.setState({ tooltipOpen: true });
          track('openWidgetSettings', {
            label: title
          });
        }}
        arrow
        useContext
        open={tooltipOpen}
        html={
          <WidgetSettings
            ref={node => {
              this.widgetSettingsRef = node;
            }}
            settingsConfig={settingsConfig}
            loading={loading}
            handleChangeSettings={handleChangeSettings}
            handleShowInfo={handleShowInfo}
          />
        }
      >
        <Button
          theme="theme-button-small square"
          tooltip={{ text: 'Filter and customize the data' }}
        >
          <Icon icon={settingsIcon} className="settings-icon" />
        </Button>
      </Tooltip>
    );
  }
}

export default WidgetSettingsButton;
