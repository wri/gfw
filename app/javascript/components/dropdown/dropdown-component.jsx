import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { deburrUpper } from 'utils/data';
import { isTouch } from 'utils/browser';
import groupBy from 'lodash/groupBy';
import remove from 'lodash/remove';

import Downshift from 'downshift';
import Button from 'components/button';
import Icon from 'components/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/tip';

import infoIcon from 'assets/icons/info.svg';
import arrowDownIcon from 'assets/icons/arrow-down.svg';
import closeIcon from 'assets/icons/close.svg';

import './dropdown-styles.scss';
import './themes/dropdown-dark.scss';
import './themes/dropdown-button.scss';

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      inputValue: '',
      isOpen: false,
      showGroup: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.setState({ options: nextProps.options });
    }
  }

  handleChange = () => {
    this.setState({ inputValue: '' });
  };

  handleStateChange = (changes, downshiftStateAndHelpers) => {
    if (!downshiftStateAndHelpers.isOpen) {
      this.setState({ inputValue: '' });
    } else if ((changes && changes.inputValue) || changes.inputValue === '') {
      this.setState({ inputValue: changes.inputValue });
    }
    if (changes && changes.selectedItem) {
      this.setState({ isOpen: false, inputValue: '' });
    }
  };

  render() {
    const {
      className,
      theme,
      label,
      infoAction,
      tooltip,
      value,
      placeholder,
      searchable,
      clearable,
      noItemsFound,
      optionsAction,
      optionsActionKey,
      arrowPosition,
      noSelectedValue,
      modalOpen,
      modalClosing
    } = this.props;
    const isDeviceTouch = isTouch();

    const checkModalCloing = () => {
      if (!modalOpen && !modalClosing) {
        this.setState({ isOpen: false });
      }
    };

    const dropdown = (
      <Downshift
        itemToString={i => i && i.label}
        onChange={this.handleChange}
        onStateChange={this.handleStateChange}
        inputValue={this.state.inputValue}
        selectedItem={value}
        defaultHighlightedIndex={0}
        onOuterClick={checkModalCloing}
        isOpen={this.state.isOpen}
        {...this.props}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          selectedItem,
          highlightedIndex,
          clearSelection
        }) => {
          const { inputValue, options, showGroup } = this.state;

          const onInputClick = () => {
            if (!searchable && isOpen) {
              this.setState({ isOpen: false, showGroup: '' });
            } else {
              this.setState({ isOpen: true, inputValue: '' });
            }
          };

          const onSelectorClick = () => {
            this.setState({ isOpen: !isOpen, inputValue: '' });
          };

          const newItems = groupBy(
            inputValue
              ? options.filter(
                item =>
                  deburrUpper(item.label).indexOf(deburrUpper(inputValue)) >
                    -1
              )
              : options,
            'category'
          );

          const activeValue =
            typeof selectedItem === 'string' || typeof selectedItem === 'number'
              ? options.find(o => o.value === selectedItem)
              : selectedItem;
          const activeLabel =
            (activeValue && activeValue.label) || noSelectedValue;

          const groups = remove(Object.keys(newItems), r => r !== 'undefined');
          const list = newItems.undefined || [];
          const listWithGroups = list.concat(
            groups.map(g => ({ label: g, value: g, group: g }))
          );
          let listWithGroupsAndItems = listWithGroups;
          groups.forEach(g => {
            listWithGroupsAndItems = listWithGroupsAndItems.concat(newItems[g]);
          });

          const inputProps = getInputProps({
            placeholder: isOpen && searchable ? placeholder : '',
            onClick: onInputClick,
            readOnly: !isOpen || !searchable,
            onKeyDown: e => {
              if (e.key === 'Enter') {
                const selectedIndex = parseInt(e.target.id.split('-')[1], 10);
                const selected = listWithGroupsAndItems[selectedIndex];
                if (selected && selected.group) {
                  e.preventDownshiftDefault = true;
                  this.setState({
                    showGroup:
                      showGroup === selected.group ? '' : selected.group,
                    highlightedIndex: selectedIndex + 1
                  });
                }
              }
            }
          });

          const menu = !isOpen ? null : (
            <div className="menu">
              {listWithGroupsAndItems && listWithGroupsAndItems.length ? (
                listWithGroupsAndItems.map((item, index) => (
                  <div
                    key={item.value}
                    className={`item-wrapper
                    ${item.group ? 'group' : ''} ${
                    item.category ? 'category' : ''
                  }
                    ${
                  (!showGroup && !item.category) ||
                      (item.category === showGroup || item.group === showGroup)
                    ? 'show'
                    : ''
                  }`}
                  >
                    <div
                      {...getItemProps({
                        item,
                        index,
                        className: `item
                        ${
                  highlightedIndex === index ||
                          activeLabel === item.label ||
                          (item.group && item.group === showGroup) ||
                          (item.group &&
                            activeValue &&
                            item.group === activeValue.category)
                    ? 'highlight'
                    : ''
                  }`
                      })}
                      {...!!item.group && {
                        onClick: () => {
                          this.setState({
                            showGroup:
                              item.group === showGroup ? '' : item.group,
                            isOpen: true
                          });
                        }
                      }}
                    >
                      {item.label}
                    </div>
                    {item.metaKey && (
                      <Button
                        className="theme-button-small square info-button"
                        onClick={() => optionsAction(item[optionsActionKey])}
                      >
                        <Icon icon={infoIcon} className="info-icon" />
                      </Button>
                    )}
                    {item.group && (
                      <Icon
                        icon={arrowDownIcon}
                        className={`group-icon ${
                          showGroup === item.group ? 'selected' : ''
                        }`}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="item not-found">
                  {noItemsFound || 'No results found'}
                </div>
              )}
            </div>
          );

          const selector = (
            <div className={`container ${isOpen ? 'is-open' : ''}`}>
              <div className={`selector ${arrowPosition ? 'align-left' : ''}`}>
                {arrowPosition === 'left' && (
                  <button className="arrow-btn" onClick={onSelectorClick}>
                    <Icon className="arrow" icon={arrowDownIcon} />
                  </button>
                )}
                <span
                  className={`value ${!activeValue ? 'no-value' : ''} ${
                    clearable && activeValue ? 'clearable' : ''
                  }`}
                >
                  {(isOpen && !searchable) || !isOpen ? activeLabel : ''}
                </span>
                <input {...inputProps} />
                {clearable &&
                  activeValue && (
                    <button className="clear-btn" onClick={clearSelection}>
                      <Icon icon={closeIcon} className="clear-icon" />
                    </button>
                  )}
                {arrowPosition !== 'left' && (
                  <button className="arrow-btn" onClick={onSelectorClick}>
                    <Icon className="arrow" icon={arrowDownIcon} />
                  </button>
                )}
              </div>
              <div className="menu-arrow" />
              {menu}
            </div>
          );

          return selector;
        }}
      </Downshift>
    );

    return (
      <div className={`c-dropdown ${theme || ''} ${className || ''}`}>
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
  clearable: PropTypes.bool
};

export default Dropdown;
