import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Button from 'components/ui/button/button-component';

import './styles.scss';

class MapMenuSearch extends PureComponent {
  renderLoginWindow() {
    const { isDesktop } = this.props;
    return (
      <div className="content">
        <div className="row">
          {isDesktop && <h3 className="title-login">Please log in</h3>}
          <p>
            Log in is required so you can view, manage, and delete your Areas of
            Interest.
          </p>
          <p>
            Creating an Area of Interest lets you customize and perform an
            in-depth analysis of the area, as well as receiving email
            notifications when new deforestation alerts are available.
          </p>
          <MyGFWLogin className="mygfw-login" simple />
        </div>
      </div>
    );
  }

  renderMyGFW() {
    const { isDesktop } = this.props;
    return (
      <div className="content">
        <div className="row">
          {isDesktop && (
            <h2 className="title-create-aois">
              You haven&apos;t created any Areas of Interest yet
            </h2>
          )}
          <p>
            Creating an Area of Interest lets you customize and perform an
            in-depth analysis of the area, as well as receiving email
            notifications when new deforestation alerts are available.
          </p>
          <Button theme="theme-button-small">Learn how</Button>
        </div>
      </div>
    );
  }

  render() {
    const { loggedIn } = this.props;

    return (
      <div className="c-map-menu-my-gfw">
        {loggedIn ? this.renderMyGFW() : this.renderLoginWindow()}
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  isDesktop: PropTypes.bool,
  loggedIn: PropTypes.bool
};

export default MapMenuSearch;
