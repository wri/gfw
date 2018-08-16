import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import helpIcon from 'assets/images/help.png';

import './styles.scss';

class CountriesStatement extends PureComponent {
  render() {
    const { className, countries } = this.props;

    return (
      <Tooltip
        theme="tip"
        arrow
        hideOnClick
        html={<Tip text={countries} />}
        position="top"
        followCursor
      >
        <div
          className={`c-countries-statement ${className || ''}`}
          style={{ cursor: `url(${helpIcon}), auto` }}
        >
          This layer is only available for <span>certain countries.</span>
        </div>
      </Tooltip>
    );
  }
}

CountriesStatement.propTypes = {
  className: PropTypes.string,
  countries: PropTypes.string
};

export default CountriesStatement;
