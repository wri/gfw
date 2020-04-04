import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import arrowIcon from 'assets/icons/flechita.svg?sprite';
import './styles.scss';

class ItemsList extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, itemSelected, onClick, className } = this.props;
    return (
      <ul className={`c-items-list text -paragraph -color-2 ${className}`}>
        {data.map(d => (
          <li
            key={d.label}
            className={d.label === itemSelected ? '-selected' : ''}
          >
            <button onClick={() => onClick && onClick(d.label)}>
              <Icon icon={arrowIcon} className="icon" /> {d.label}{' '}
              {d.count && `(${d.count})`}
            </button>
          </li>
        ))}
      </ul>
    );
  }
}

ItemsList.propTypes = {
  data: PropTypes.array.isRequired,
  itemSelected: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default ItemsList;
