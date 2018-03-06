import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { deburrUpper } from 'utils/data';
import { isTouch } from 'utils/browser';

import Downshift from 'downshift';
import Select from 'react-select-me';
import Button from 'components/button';
import Icon from 'components/icon';
import { Tooltip } from 'react-tippy';
import Tip from 'components/tip';

import infoIcon from 'assets/icons/info.svg';
import arrowDownIcon from 'assets/icons/arrow-down.svg';
import './dropdown-styles.scss';
import 'styles/themes/dropdown/dropdown-dark.scss'; // eslint-disable-line
import 'styles/themes/dropdown/dropdown-light.scss'; // eslint-disable-line
import 'styles/themes/dropdown/dropdown-button.scss'; // eslint-disable-line

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      inputValue: ''
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
    } else if (changes && changes.inputValue) {
      this.setState({ inputValue: changes.inputValue });
    }
    console.log(changes);
  };

  render() {
    const {
      theme,
      label,
      infoAction,
      modalOpen,
      modalClosing,
      tooltip,
      value,
      placeholder,
      searchable
    } = this.props;
    // const isDeviceTouch = isTouch();
    // const dropdown = (
    //   <Select
    //     iconRenderer={() => (
    //       <Icon icon={arrowDownIcon} className="icon icon-arrow-down" />
    //     )}
    //     beforeClose={() => {
    //       if (modalOpen || modalClosing) {
    //         return false;
    //       }
    //       return true;
    //     }}
    //     {...this.props}
    //     options={this.state.options}
    //   />
    // );

    return (
      <Downshift
        itemToString={i => i && i.label}
        onChange={this.handleChange}
        onStateChange={this.handleStateChange}
        inputValue={this.state.inputValue}
        selectedItem={value}
        {...this.props}
      >
        {({
          getInputProps,
          getButtonProps,
          getItemProps,
          isOpen,
          selectedItem,
          highlightedIndex,
          openMenu
        }) => {
          const { inputValue, options } = this.state;

          const onInputClick = () => {
            openMenu();
          };

          const inputProps = getInputProps({
            placeholder: isOpen ? placeholder : '',
            onClick: onInputClick,
            readOnly: !isOpen || !searchable
          });

          const newItems = inputValue
            ? options.filter(item =>
              item.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            : options;

          return (
            <div className={`c-dropdown ${theme || 'theme-select-light'}`}>
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
              <div className="container">
                {!isOpen && <div className="value">{value && value.label}</div>}
                <input {...inputProps} />
                <Icon
                  {...getButtonProps()}
                  className="arrow"
                  icon={arrowDownIcon}
                />
              </div>
              {!isOpen ? null : (
                <div className="menu">
                  {newItems.map((item, index) => (
                    <div
                      key={item.value}
                      {...getItemProps({
                        item,
                        index,
                        className:
                          highlightedIndex === index ||
                          selectedItem.value === item.value
                            ? 'highlight'
                            : ''
                        // isActive: highlightedIndex === index,
                        // isSelected: selectedItem.value === item.value,
                        // onMouseDown: this.onItemMouseDown, // Fixes the issue
                      })}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      </Downshift>

      // <div className={`c-dropdown ${theme || 'theme-select-light'}`}>
      //   {label && (
      //     <div className="label">
      //       {label}
      //       {infoAction && (
      //         <Button
      //           className="theme-button-small square info-button"
      //           onClick={infoAction}
      //         >
      //           <Icon icon={infoIcon} className="info-icon" />
      //         </Button>
      //       )}
      //     </div>
      //   )}
      //   {tooltip ? (
      //     <Tooltip
      //       theme="tip"
      //       position="top"
      //       arrow
      //       disabled={isDeviceTouch}
      //       html={<Tip text={tooltip.text} />}
      //       {...tooltip}
      //     >
      //       {dropdown}
      //     </Tooltip>
      //   ) : (
      //     dropdown
      //   )}
      // </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.array,
  infoAction: PropTypes.func,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  tooltip: PropTypes.object
};

export default Dropdown;
