import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import arrowDownIcon from 'assets/icons/arrow-down.svg';

import './styles.scss';

class Paginate extends PureComponent {
  render() {
    const { settings, count, onClickChange, className } = this.props;
    const { page, pageSize } = settings;
    const showPrev = page > 0;
    const showNext = count > pageSize * (page + 1);

    return (
      <div className={`c-paginate ${className || ''}`}>
        <Button
          className="button-up square theme-button-small theme-button-grey"
          onClick={() => onClickChange(-1)}
          disabled={!showPrev}
        >
          <Icon icon={arrowDownIcon} className="icon" />
        </Button>
        <Button
          className="button-down square theme-button-small theme-button-grey"
          onClick={() => onClickChange(1)}
          disabled={!showNext}
        >
          <Icon icon={arrowDownIcon} className="icon" />
        </Button>
      </div>
    );
  }
}

Paginate.propTypes = {
  settings: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onClickChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Paginate;
