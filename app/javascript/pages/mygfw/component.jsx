import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';

import './styles.scss';

class MyGFWPage extends PureComponent {
  render() {
    const { loggedIn, myGfwLoading } = this.props;
    return (
      <div className="l-mygfw-page">
        <div className="header-banner">
          <div className="row">
            <div className="column small-12">
              <h1>My GFW</h1>
              <div className="user-profile" />
            </div>
          </div>
        </div>
        <div className="my-gfw-container">
          <div className="row">
            {myGfwLoading && <Loader className="mygfw-loader" />}
            {!loggedIn &&
              !myGfwLoading && (
              <div className="column small-12 medium-6 medium-offset-3">
                <MyGFWLogin />
              </div>
            )}
            {loggedIn &&
              !myGfwLoading && (
              <div className="column small-12">Areas of interest</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

MyGFWPage.propTypes = {
  loggedIn: PropTypes.bool,
  myGfwLoading: PropTypes.bool
};

export default MyGFWPage;
