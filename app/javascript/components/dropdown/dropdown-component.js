import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';
import { deburrUpper } from 'utils/data';

import 'styles/themes/dropdown/dropdown-dark.scss';
import 'styles/themes/dropdown/dropdown-light.scss';
import 'styles/themes/dropdown/dropdown-button.scss';
import './dropdown-styles.scss';

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
    const { theme, label } = this.props;
    return (
      <div className={`c-dropdown ${theme || 'theme-select-light'}`}>
        {label && <div className="label">{label}</div>}{' '}
        <Select
          iconRenderer={() => (
            <svg className="icon icon-angle-arrow-down">
              <use xlinkHref="#icon-angle-arrow-down">{}</use>
            </svg>
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
  options: PropTypes.array
};

export default Dropdown;
