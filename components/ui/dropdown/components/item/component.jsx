import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';

import arrowDownIcon from 'assets/icons/arrow-down.svg?sprite';
import infoIcon from 'assets/icons/info.svg?sprite';
import helpIcon from 'assets/icons/help.svg?sprite';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

const Item = (props) => {
  const {
    index,
    item,
    showGroup,
    highlightedIndex,
    getItemProps,
    handleSelectGroup,
    optionsAction,
    optionsActionKey,
    activeValue,
    activeLabel,
  } = props;
  const {
    group,
    groupParent,
    label,
    component = null,
    metaKey,
    infoText,
    disabled,
    tooltipText,
  } = item;
  const isActive =
    (!showGroup && !group) || group === showGroup || groupParent === showGroup;
  const isGroupParentActive = groupParent && showGroup === groupParent;
  const isHighlighted =
    highlightedIndex === index ||
    activeLabel === label ||
    (groupParent && groupParent === showGroup) ||
    (groupParent && activeValue && groupParent === activeValue.group);

  const renderItem = () => {
    return (
      <div
        id={`option-${item.value}`}
        className={`c-selector-item-wrapper
            ${isActive ? 'show' : ''}
            ${!group ? 'base' : ''}
            ${isGroupParentActive ? 'selected' : ''}
            ${groupParent ? 'group-parent' : ''}
            ${disabled ? 'disabled' : ''}
          `}
      >
        {isGroupParentActive && (
          <Icon
            icon={arrowDownIcon}
            className="group-icon selected"
            onClick={() => handleSelectGroup(item)}
          />
        )}
        <div
          {...getItemProps({
            item,
            index,
            className: `c-selector-item ${isHighlighted ? 'highlight' : ''}`,
          })}
          {...(!!groupParent && {
            onClick: () => handleSelectGroup(item),
          })}
        >
          {component && component}
          {!component && label}
        </div>
        {metaKey && (
          <Button
            className="theme-button-small square info-button"
            onClick={() => {
              optionsAction(item[optionsActionKey]);
            }}
            tooltip={infoText && { text: infoText }}
          >
            <Icon icon={infoIcon} className="info-icon" />
          </Button>
        )}
        {!metaKey && infoText && (
          <Button
            className="theme-button-small square info-button"
            tooltip={{ text: infoText }}
          >
            <Icon icon={helpIcon} className="info-icon" />
          </Button>
        )}
        {groupParent && showGroup !== groupParent && (
          <Icon
            icon={arrowDownIcon}
            className={`group-icon ${
              showGroup === groupParent ? 'selected' : ''
            }`}
          />
        )}
      </div>
    );
  };

  if (tooltipText) {
    return (
      <Tooltip
        theme="tip"
        position="top"
        arrow
        hideOnClick
        html={<Tip text={tooltipText} />}
        touchHold
      >
        {renderItem()}
      </Tooltip>
    );
  }

  return renderItem();
};

Item.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  showGroup: PropTypes.string,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.func,
  handleSelectGroup: PropTypes.func,
  optionsAction: PropTypes.func,
  optionsActionKey: PropTypes.string,
  activeValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  activeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Item;
