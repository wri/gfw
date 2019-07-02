import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  render() {
    const { isDesktop, loggedIn } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        <div className="content">
          <div className="row">
            {isDesktop &&
              (loggedIn ? (
                <h2>You haven&apos;t created any Areas of Interest yet</h2>
              ) : (
                <h3>Please log in</h3>
              ))}
            {!loggedIn && (
              <p>
                Log in is required so you can view, manage, and delete your
                Areas of Interest.
              </p>
            )}
            <p>
              Creating an Area of Interest lets you customize and perform an
              in-depth analysis of the area, as well as receiving email
              notifications when new deforestation alerts are available.
            </p>
            {!loggedIn && <MyGFWLogin className="mygfw-header submenu" />}
          </div>
        </div>
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  isDesktop: PropTypes.bool,
  loggedIn: PropTypes.bool
};

export default MapMenuSearch;
