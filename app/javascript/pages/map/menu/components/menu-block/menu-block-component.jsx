import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './menu-block-styles.scss';

class MenuBlock extends PureComponent {
  render() {
    const { title, subTitle, children } = this.props;
    return (
      <div className="c-menu-block">
        {(title || subTitle) && (
          <div className="c-menu-block__header">
            {title && <div className="c-menu-block__title">{title}</div>}
            {subTitle && (
              <div className="c-menu-block__subtitle">{subTitle}</div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
}

MenuBlock.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.node
};

export default MenuBlock;
