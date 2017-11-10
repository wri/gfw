import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// import styles from './header-styles.scss';

class Header extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header className="m-cover">
        <div className="l-inner">
          <h2 className="m-cover__title">Small Grants Fund</h2>
        </div>
        <div
          className="cover-background"
          style={{
            backgroundImage:
              "url('/assets/static-pages/small-grants-fund/SGF_headermap.jpg')"
          }}
        />
      </header>
    );
  }
}

export default Header;
