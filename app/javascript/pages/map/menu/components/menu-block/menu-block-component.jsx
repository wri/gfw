import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './menu-block-styles.scss';

class MenuBlock extends PureComponent {
  render() {
    const { name, description, children } = this.props;
    return (
      <div className="c-menu-block">
        {(name || description) && (
          <div className="c-menu-block__header">
            {name && <div className="c-menu-block__title">{name}</div>}
            {description && (
              <div className="c-menu-block__description">{description}</div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
}

MenuBlock.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node
};

export default MenuBlock;
