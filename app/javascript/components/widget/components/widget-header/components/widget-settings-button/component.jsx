import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { isParent } from 'utils/dom';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import settingsIcon from 'assets/icons/settings.svg';
import WidgetSettings from '../widget-settings';

import './styles.scss';

class WidgetSettingsButton extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    settings: PropTypes.object,
    config: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    options: PropTypes.array
  };

  state = {
    tooltipOpen: false
  };

  render() {
    const {
      title,
      locationName,
      settings,
      config,
      loading,
      widget,
      options,
      modalClosing,
      setWidgetSettings,
      setModalMetaSettings
    } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <Tooltip
        className="widget-tooltip-theme"
        theme="light"
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

          if (!modalClosing && !isTargetOnTooltip) {
            this.setState({ tooltipOpen: false });
          }
        }}
        onShow={() => this.setState({ tooltipOpen: true })}
        arrow
        useContext
        open={tooltipOpen}
        html={
          <WidgetSettings
            ref={node => {
              this.widgetSettingsRef = node;
            }}
            widget={widget}
            settings={settings}
            config={config}
            options={options}
            loading={loading}
            onSettingsChange={setWidgetSettings}
            setModalMetaSettings={setModalMetaSettings}
          />
        }
      >
        <Button
          className="theme-button-small square"
          tooltip={{ text: 'Filter and customize the data' }}
          trackingData={{
            event: 'open-settings',
            label: `${title} in ${locationName || ''}`
          }}
        >
          <Icon icon={settingsIcon} className="settings-icon" />
        </Button>
      </Tooltip>
    );
  }
}

export default WidgetSettingsButton;
