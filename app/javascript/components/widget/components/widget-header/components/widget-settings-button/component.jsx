import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import settingsIcon from 'assets/icons/settings.svg';
import WidgetSettings from '../widget-settings';

class WidgetSettingsButton extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    loading: PropTypes.bool,
    preventCloseSettings: PropTypes.bool,
    handleChangeSettings: PropTypes.func.isRequired,
    handleShowInfo: PropTypes.func.isRequired
  };

  state = {
    tooltipOpen: false
  };

  render() {
    const {
      options,
      loading,
      preventCloseSettings,
      handleChangeSettings,
      handleShowInfo
    } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <Tooltip
        className="c-widget-settings-button"
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
        }}
        arrow
        useContext
        open={tooltipOpen}
        html={
          <WidgetSettings
            ref={node => {
              this.widgetSettingsRef = node;
            }}
            options={options}
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
