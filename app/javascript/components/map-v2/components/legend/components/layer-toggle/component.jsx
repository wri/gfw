import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Toggle from 'components/ui/toggle';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg';

import './styles.scss';

class LayerToggle extends PureComponent {
  render() {
    const { className, data, onInfoClick, onToggle, small } = this.props;
    const {
      name,
      subtitle,
      metadata,
      layer,
      dataset,
      iso,
      active,
      color,
      description
    } = data;

    return (
      <div
        className={`c-layer-toggle ${small ? '-small' : ''} ${className || ''}`}
      >
        <Toggle
          theme={!small ? 'toggle-large' : ''}
          value={active}
          onToggle={value => onToggle({ dataset, layer, iso }, value)}
          color={color}
        />
        <div className="c-layer-toggle__content">
          <div className="c-layer-toggle__header">
            <div className="c-layer-toggle__name">{name}</div>
            {((!metadata && description) ||
              (metadata && typeof metadata === 'string')) && (
                <Tooltip
                  theme="tip"
                  arrow
                  hideOnClick
                  position="top"
                  disabled={!description}
                  html={<Tip text={description} />}
                >
                  <Button
                    className={`theme-button-tiny ${
                      small ? 'theme-button-grey-filled' : ''
                    } square info-button ${!metadata ? '-help' : ''}`}
                    onClick={metadata && (() => onInfoClick(metadata))}
                  >
                    <Icon icon={infoIcon} className="info-icon" />
                  </Button>
                </Tooltip>
              )}
          </div>
          {subtitle && (
            <div className="c-layer-toggle__subtitle">{`${subtitle}`}</div>
          )}
        </div>
      </div>
    );
  }
}

LayerToggle.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  onInfoClick: PropTypes.func,
  onToggle: PropTypes.func,
  small: PropTypes.bool
};

export default LayerToggle;
