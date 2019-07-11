import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';

import UserProfile from './components/user-profile';
import NoAreasImage from './assets/no-areas@2x.png';
import './styles.scss';

class MyGFWPage extends PureComponent {
  render() {
    const { loggedIn, myGfwLoading, areas } = this.props;
    return (
      <div className="l-mygfw-page">
        <div className="header-banner">
          <div className="row">
            <div className="column small-12">
              <div className="user-profile">
                <h1>My GFW</h1>
                {loggedIn && <UserProfile />}
              </div>
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
              <div className="column small-12">
                {areas && !!areas.length ? (
                  <div className="areas-table">Look at them</div>
                ) : (
                  <div className="row no-areas">
                    <div className="column small-12 medium-5">
                      <img
                        className="areas-image"
                        srcSet={`${NoAreasImage} 2x, ${NoAreasImage} 1x`}
                        src={`${NoAreasImage} 1x`}
                        alt="no areas"
                      />
                    </div>
                    <div className="column small-12 medium-6">
                      <h4>You haven’t created any Areas of Interest yet</h4>
                      <p>
                          Creating an Area of Interest lets you customize and
                          perform an in-depth analysis of the area, as well as
                          receiving email notifications when new deforestation
                          alerts are available.
                      </p>
                      <Button className="learn-btn" link="/map">
                          Learn how
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

MyGFWPage.propTypes = {
  loggedIn: PropTypes.bool,
  myGfwLoading: PropTypes.bool,
  areas: PropTypes.array
};

export default MyGFWPage;
