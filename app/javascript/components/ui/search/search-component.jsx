import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import debounce from 'lodash/debounce';

import searchIcon from 'assets/icons/search.svg';
import closeIcon from 'assets/icons/close.svg';
import './search-styles.scss';
import './themes/search-light.scss'; // eslint-disable-line

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: props.input
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input !== this.props.input) {
      this.setState({ search: nextProps.input });
    }
  }

  handleChange = value => {
    this.setState({ search: value });
    this.debouncedChange();
  };

  handleKeyUp = e => {
    e.preventDefault();
    const { onSubmit } = this.props;
    if (onSubmit && e.keyCode === 13) {
      onSubmit(e);
    }
  };

  debouncedChange = debounce(() => {
    const { onChange } = this.props;
    if (onChange) {
      this.props.onChange(this.state.search);
    }
  }, 150);

  render() {
    const { search } = this.state;
    const { placeholder, onSubmit, disabled, className, theme } = this.props;
    return (
      <div
        className={`c-search ${theme || 'theme-search-light'} ${className ||
          ''}`}
      >
        <input
          type="text"
          className="input text"
          placeholder={placeholder}
          onChange={e => this.handleChange(e.target.value)}
          value={search}
          onKeyUp={this.handleKeyUp}
          disabled={disabled}
        />
        <button onClick={onSubmit}>
          <Icon icon={searchIcon} className="icon-search" />
        </button>
        {search && (
          <Button
            className="clear-btn"
            theme="theme-button-clear theme-button-small square"
            onClick={() => this.handleChange('')}
          >
            <Icon icon={closeIcon} className="icon-close" />
          </Button>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  input: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  theme: PropTypes.string
};

Search.defaultProps = {
  input: ''
};

export default Search;
