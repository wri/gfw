import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import ShareModal from 'components/modals/share';
import ProfileModal from 'components/modals/profile';
import ProfileForm from 'components/forms/profile';
import LoginForm from 'components/forms/login';

import AreasProvider from 'providers/areas-provider';
import CountryDataProvider from 'providers/country-data-provider';
import DashboardImage from 'assets/images/aois/aoi-dashboard-small.png';
import DashboardImageLarge from 'assets/images/aois/aoi-dashboard-small@2x.png';

import AreaOfInterestModal from 'components/modals/area-of-interest';
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
      <div className={cx('l-my-gfw-page', { login: !loggedIn })}>
        {loggedIn ? (
          <Fragment>
            <div className="header-banner">
              <div className="row">
                <div className="column small-12 medium-6">
                  <h1>My GFW</h1>
                </div>
                <div className="column small-12 medium-6">
                  {loggedIn &&
                    process.env.FEATURE_ENV === 'staging' && <UserProfile />}
                </div>
              </div>
            </div>
            <div className="my-gfw-container">
              <div className="row">
                {loggedIn && loading && <Loader className="mygfw-loader" />}
                {loggedIn &&
                  process.env.FEATURE_ENV !== 'staging' && (
                  <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
                    <ProfileForm />
                  </div>
                )}
                {loggedIn &&
                  process.env.FEATURE_ENV === 'staging' &&
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
                          <h4>
                              You haven’t created any Areas of Interest yet
                          </h4>
                          <p>
                              Creating an Area of Interest lets you customize
                              and perform an in-depth analysis of the area, as
                              well as receiving email notifications when new
                              deforestation alerts are available.
                          </p>
                          <Button
                            className="learn-btn"
                            link="/map?analysis=eyJzaG93RHJhdyI6ZmFsc2V9&mainMap=eyJzaG93QW5hbHlzaXMiOnRydWV9&map=eyJjZW50ZXIiOnsibGF0IjoyNywibG5nIjoxMn0sImJlYXJpbmciOjAsInBpdGNoIjowLCJ6b29tIjoyfQ%3D%3D&mapPrompts=eyJvcGVuIjp0cnVlLCJzdGVwc0tleSI6ImFyZWFPZkludGVyZXN0VG91ciIsInN0ZXBJbmRleCI6MCwiZm9yY2UiOnRydWV9"
                          >
                              Learn how
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {process.env.FEATURE_ENV === 'staging' && (
              <Fragment>
                <AreasProvider />
                <AreaOfInterestModal canDelete />
              </Fragment>
            )}
            <CountryDataProvider />
            <ShareModal />
            <ProfileModal />
          </Fragment>
        ) : (
          <div className="row">
            <div className="column small-12 medium-10 medium-offset-1 large-8 large-offset-2">
              <LoginForm />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MyGFWPage;
