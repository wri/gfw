import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import arrowIcon from 'assets/icons/flechita.svg';
import './items-list-styles.scss';

class ItemsList extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data, itemSelected, onClick } = this.props;
    return (
      <ul className="c-items-list text -paragraph -color-2">
        {data.map(d => (
          <li key={d} className={d === itemSelected ? '-selected' : ''}>
            <button onClick={() => onClick && onClick(d)}>
              <Icon icon={arrowIcon} className="icon" /> {d}
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
  onClick: PropTypes.func
};

export default ItemsList;
