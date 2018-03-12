import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Button from 'components/button';

import arrowDownIcon from 'assets/icons/arrow-down.svg';
import infoIcon from 'assets/icons/info.svg';

const Item = props => {
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
    activeLabel
  } = props;
  const { group, groupParent, label, metaKey } = item;

  const isActive =
    (!showGroup && !group) ||
    (group === showGroup || groupParent === showGroup);
  const isGroupParentActive = groupParent && showGroup === groupParent;
  const isHighlighted =
    highlightedIndex === index ||
    activeLabel === label ||
    (groupParent && groupParent === showGroup) ||
    (groupParent && activeValue && groupParent === activeValue.group);

  return (
    <div
      className={`item-wrapper
        ${isActive ? 'show' : ''}
        ${!group ? 'base' : ''}
        ${isGroupParentActive ? 'selected' : ''}
        ${groupParent ? 'group-parent' : ''}
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
          className: `item ${isHighlighted ? 'highlight' : ''}`
        })}
        {...!!groupParent && {
          onClick: () => handleSelectGroup(item)
        }}
      >
        {label}
      </div>
      {metaKey && (
        <Button
          className="theme-button-small square info-button"
          onClick={() => optionsAction(item[optionsActionKey])}
        >
          <Icon icon={infoIcon} className="info-icon" />
        </Button>
      )}
      {groupParent &&
        showGroup !== groupParent && (
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

Item.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  showGroup: PropTypes.string,
  highlightedIndex: PropTypes.number,
  getItemProps: PropTypes.func,
  handleSelectGroup: PropTypes.func,
  optionsAction: PropTypes.func,
  optionsActionKey: PropTypes.string,
  activeValue: PropTypes.object,
  activeLabel: PropTypes.string
};

export default Item;
