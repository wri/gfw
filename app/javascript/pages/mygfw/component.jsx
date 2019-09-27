import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import ShareModal from 'components/modals/share';
import ProfileModal from 'components/modals/profile';

import AreasProvider from 'providers/areas-provider';
import CountryDataProvider from 'providers/country-data-provider';
import PlanetBasemapsProvider from 'providers/planet-provider';
import DashboardImage from 'assets/images/aois/aoi-dashboard-small.png';
import DashboardImageLarge from 'assets/images/aois/aoi-dashboard-small@2x.png';

import SaveAOIModal from 'components/modals/save-aoi';
import UserProfile from './components/user-profile';
import AreasTable from './components/areas-table';
import './styles.scss';

class MyGFWPage extends PureComponent {
  static propTypes = {
    loggedIn: PropTypes.bool,
    loading: PropTypes.bool,
    areas: PropTypes.array
  };

  render() {
    const { loggedIn, loading, areas } = this.props;

    return (
      <div className="l-mygfw-page">
        <div className="header-banner">
          <div className="row">
            <div className="column small-12 medium-6">
              <h1>My GFW</h1>
            </div>
            <div className="column small-12 medium-6">
              {loggedIn && <UserProfile />}
            </div>
          </div>
        </div>
        <div className="my-gfw-container">
          <div className="row">
            {loading && <Loader className="mygfw-loader" />}
            {!loggedIn &&
              !loading && (
              <div className="column small-12 medium-4 medium-offset-4">
                <p className="login-intro">
                    Login to manage your profile and areas of interest.
                    Questions?{' '}
                  <a
                    href="mailto:gfw@wri.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      Contact us
                  </a>.
                </p>
                <MyGFWLogin />
              </div>
            )}
            {loggedIn &&
              !loading && (
              <div className="column small-12">
                {areas && !!areas.length ? (
                  <div className="row">
                    <div className="column small-12">
                      <AreasTable />
                    </div>
                  </div>
                ) : (
                  <div className="row no-areas">
                    <div className="column small-12 medium-5">
                      <img
                        className="areas-image"
                        srcSet={`${DashboardImageLarge} 2x, ${
                          DashboardImage
                        } 1x`}
                        src={`${DashboardImage} 1x`}
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
        <AreasProvider />
        <CountryDataProvider />
        <PlanetBasemapsProvider />
        <SaveAOIModal canDelete />
        <ShareModal />
        <ProfileModal />
      </div>
    );
  }
}

export default MyGFWPage;
