import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';
import { deburrUpper } from 'utils/data';
import Button from 'components/button';
import Icon from 'components/icon';

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
    const { theme, label, infoAction } = this.props;
    return (
      <div className={`c-dropdown ${theme || 'theme-select-light'}`}>
        {label && (
          <div className="label">
            {label}
            {infoAction && (
              <Button
                disabled
                className="theme-button-small square info-button"
              >
                <Icon
                  icon={infoIcon}
                  className="info-icon"
                  onClick={infoAction}
                />
              </Button>
            )}
          </div>
        )}
        <Select
          iconRenderer={() => (
            <Icon icon={arrowDownIcon} className="icon icon-arrow-down" />
          )}
          onSearch={this.handleSearch}
          {...this.props}
          options={this.state.options}
        />
      </div>
    );
  }
}

Dropdown.propTypes = {
  label: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.array,
  infoAction: PropTypes.func
};

export default Dropdown;
