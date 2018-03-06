import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { deburrUpper } from 'utils/data';
import { isTouch } from 'utils/browser';

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
    this.state = { options: props.options };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.setState({ options: nextProps.options });
    }
  }

  handleSearch = query => {
    this.setState({
      options: this.props.options.filter(
        o => deburrUpper(o.label).indexOf(deburrUpper(query)) > -1
      )
    });
  };

  render() {
    const {
      theme,
      label,
      infoAction,
      modalOpen,
      modalClosing,
      tooltip
    } = this.props;
    const isDeviceTouch = isTouch();
    const dropdown = (
      <Select
        iconRenderer={() => (
          <Icon icon={arrowDownIcon} className="icon icon-arrow-down" />
        )}
        beforeClose={() => {
          if (modalOpen || modalClosing) {
            return false;
          }
          return true;
        }}
        onSearch={this.handleSearch}
        {...this.props}
        options={this.state.options}
      />
    );

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
        {tooltip ? (
          <Tooltip
            theme="tip"
            position="top"
            arrow
            disabled={isDeviceTouch}
            html={<Tip text={tooltip.text} />}
            {...tooltip}
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
  label: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.array,
  infoAction: PropTypes.func,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  tooltip: PropTypes.object
};

export default Dropdown;
