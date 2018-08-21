import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Downshift from 'downshift';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import infoIcon from 'assets/icons/info.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';

import Selector from './components/selector';
import Menu from './components/menu';

import './dropdown-styles.scss';
import './themes/dropdown-dark.scss';
import './themes/dropdown-light.scss';
import './themes/dropdown-button.scss';
import './themes/dropdown-button-small.scss';
import './themes/dropdown-native.scss';
import './themes/dropdown-native-button.scss';
import './themes/dropdown-native-plain.scss';

class Dropdown extends PureComponent {
  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem: {
        return {
          ...changes,
          highlightedIndex: null,
          isOpen: false,
          selectedItem: { ...changes.selectedItem }
        };
      }
      default:
        return changes;
    }
  };

  render() {
    const {
      className,
      theme,
      label,
      infoAction,
      tooltip,
      searchable,
      clearable,
      noItemsFound,
      optionsAction,
      optionsActionKey,
      arrowPosition,
      checkModalClosing,
      handleStateChange,
      handleClearSelection,
      handleSelectGroup,
      buildInputProps,
      onSelectorClick,
      isDeviceTouch,
      isOpen,
      showGroup,
      items,
      activeValue,
      activeLabel,
      highlightedIndex,
      native,
      value,
      onChange,
      options
    } = this.props;

    const dropdown = (
      <Downshift
        itemToString={i => i && i.label}
        onStateChange={handleStateChange}
        onOuterClick={checkModalClosing}
        stateReducer={this.stateReducer}
        {...this.props}
      >
        {({ getInputProps, getItemProps, getRootProps }) =>
          (native ? (
            <div className="select-wrapper">
              <select
                value={value && (value.value || value)}
                onChange={onChange}
              >
                {options &&
                  !!options.length &&
                  options.map(
                    o =>
                      o && (
                        <option key={`${o.value}-${o.label}`} value={o.value}>
                          {o.label}
                        </option>
                      )
                  )}
              </select>
              <Icon icon={arrowIcon} className="arrow-icon" />
            </div>
          ) : (
            <Selector
              isOpen={isOpen}
              arrowPosition={arrowPosition}
              onSelectorClick={onSelectorClick}
              clearable={clearable}
              activeValue={activeValue}
              activeLabel={activeLabel}
              searchable={searchable}
              inputProps={() => buildInputProps(getInputProps)}
              handleClearSelection={() => handleClearSelection()}
              {...getRootProps({ refKey: 'innerRef' })}
            >
              <Menu
                isOpen={isOpen}
                activeValue={activeValue}
                activeLabel={activeLabel}
                items={items}
                showGroup={showGroup}
                getItemProps={getItemProps}
                highlightedIndex={highlightedIndex}
                optionsAction={optionsAction}
                optionsActionKey={optionsActionKey}
                noItemsFound={noItemsFound}
                handleSelectGroup={handleSelectGroup}
              />
            </Selector>
          ))
        }
      </Downshift>
    );

    return (
      <div
        className={`c-dropdown ${
          native ? 'theme-dropdown-native' : ''
        } ${theme || ''} ${className || ''}`}
      >
        {label && (
          <div className="label">
            {label}
            {infoAction && (
              <Button
                className="theme-button-small square info-button"
                onClick={infoAction}
              >
                <Icon icon={infoIcon} className="info-icon" />
              </Button>
            )}
          </div>
        )}
        {tooltip ? (
          <Tooltip
            theme="tip"
            position="top"
            arrow
            hideOnClick
            html={<Tip text={tooltip.text} />}
            {...tooltip}
            disabled={isDeviceTouch || tooltip.disabled}
          >
            {dropdown}
          </Tooltip>
        ) : (
          dropdown
        )}
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.array,
  infoAction: PropTypes.func,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  tooltip: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  noItemsFound: PropTypes.string,
  optionsAction: PropTypes.func,
  optionsActionKey: PropTypes.string,
  arrowPosition: PropTypes.string,
  noSelectedValue: PropTypes.string,
  clearable: PropTypes.bool,
  groupKey: PropTypes.string,
  checkModalCloing: PropTypes.func,
  handleStateChange: PropTypes.func,
  handleClearSelection: PropTypes.func,
  onInputClick: PropTypes.func,
  onSelectorClick: PropTypes.func,
  isDeviceTouch: PropTypes.bool,
  inputValue: PropTypes.string,
  isOpen: PropTypes.bool,
  showGroup: PropTypes.string,
  handleSelectGroup: PropTypes.func,
  buildInputProps: PropTypes.func,
  checkModalClosing: PropTypes.func,
  items: PropTypes.array,
  activeValue: PropTypes.object,
  activeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  highlightedIndex: PropTypes.number,
  native: PropTypes.bool,
  onChange: PropTypes.func
};

export default Dropdown;
