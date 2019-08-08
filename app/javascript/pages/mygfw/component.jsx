import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFWLogin from 'components/mygfw-login';
import Loader from 'components/ui/loader';
import Button from 'components/ui/button';
import ShareModal from 'components/modals/share';

import AreasProvider from 'providers/areas-provider';

import SaveAOIModal from 'components/modals/save-aoi';
import UserProfile from './components/user-profile';
import AreasTable from './components/areas-table';
import NoAreasImage from './assets/no-areas@2x.png';
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
              <div className="column small-12 medium-6 medium-offset-3">
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
        <AreasProvider />
        <SaveAOIModal />
        <ShareModal />
      </div>
    );
  }
}

export default MyGFWPage;
