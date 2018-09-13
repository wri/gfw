import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Toggle from 'components/ui/toggle';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg';
import helpIcon from 'assets/icons/help.svg';

import './styles.scss';

class LayerToggle extends PureComponent {
  render() {
    const {
      className,
      data,
      onInfoClick,
      onToggle,
      small,
      tabIndex,
      showSubtitle
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
                    <Icon icon={metadata ? infoIcon : helpIcon} />
                  </Button>
                </Tooltip>
              )}
          </div>
          {citation &&
            showSubtitle && (
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
  tabIndex: PropTypes.number
};

export default LayerToggle;
