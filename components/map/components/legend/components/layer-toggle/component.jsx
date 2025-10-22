import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from 'utils/analytics';

import Toggle from 'components/ui/toggle';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg?sprite';
import helpIcon from 'assets/icons/help.svg?sprite';
import warningIcon from 'assets/icons/warning-nofill.svg?sprite';

class LayerToggle extends PureComponent {
  componentDidMount() {
    const { data, onToggle, category } = this.props;
    const { layer, dataset, iso, isToggledByDefault } = data;

    if (isToggledByDefault) {
      onToggle({ dataset, layer, iso, category }, true);
    }
  }

  render() {
    const {
      className,
      data,
      onInfoClick,
      onToggle,
      small,
      tabIndex,
      showSubtitle,
      category,
    } = this.props;
    const {
      name,
      metadata,
      layer,
      dataset,
      iso,
      active,
      color,
      citation,
      description,
      alerts,
    } = data;

    return (
      <div
        className={`c-layer-toggle ${small ? '-small' : ''} ${className || ''}`}
        data-layer-id={layer}
        data-component-type="layer-picker"
      >
        <Toggle
          layer={layer}
          theme={!small ? 'toggle-large' : ''}
          value={active}
          onToggle={(value) =>
            onToggle({ dataset, layer, iso, category }, value)}
          color={color}
        />
        <div className="content">
          <div className="header">
            <div
              className="name"
              onClick={() => onToggle({ dataset, layer, iso }, !active)}
              role="button"
              tabIndex={tabIndex}
            >
              {name}
            </div>
            <div className="buttons">
              {alerts &&
                alerts.map(
                  (a) =>
                    a.textTooltip && (
                      <Tooltip
                        theme="tip"
                        arrow
                        position="top"
                        html={<Tip text={a.textTooltip} />}
                      >
                        <Button className="theme-button-tiny theme-button-clear square info-button">
                          <Icon
                            icon={warningIcon}
                            style={{
                              fill:
                                a.color && a.color.length ? a.color : '#97be32',
                              width: '1rem',
                              height: '1rem',
                            }}
                          />
                        </Button>
                      </Tooltip>
                    )
                )}
              {((!metadata && description) ||
                (metadata && typeof metadata === 'string')) && (
                <Tooltip
                  theme="tip"
                  arrow
                  hideOnClick
                  position="top"
                  disabled={!description}
                  html={<Tip text={description} />}
                  onShow={() =>
                    trackEvent({
                      category: 'Open modal',
                      action: 'Hover modal button',
                      label: `${layer}: ${metadata || description}`,
                    })}
                >
                  <Button
                    id={`metadata-${layer}`}
                    className={`theme-button-tiny theme-button-grey-filled square info-button ${
                      !metadata ? '-help' : ''
                    }`}
                    onClick={metadata && (() => onInfoClick(metadata))}
                  >
                    <Icon icon={metadata ? infoIcon : helpIcon} />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
          {citation && showSubtitle && (
            <div
              className="subtitle"
              onClick={() => onToggle({ dataset, layer, iso }, !active)}
              role="button"
              tabIndex={tabIndex}
            >
              {`${citation}`}
            </div>
          )}
        </div>
      </div>
    );
  }
}

LayerToggle.propTypes = {
  showSubtitle: PropTypes.bool,
  className: PropTypes.string,
  data: PropTypes.object,
  onInfoClick: PropTypes.func,
  onToggle: PropTypes.func,
  small: PropTypes.bool,
  tabIndex: PropTypes.number,
  category: PropTypes.string,
};

export default LayerToggle;
