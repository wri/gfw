import { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Row, Column, Loader } from 'gfw-components';

import ShareModal from 'components/modals/share';
import LoginForm from 'components/forms/login';
import AreaOfInterestModal from 'components/modals/area-of-interest';

import AreasProvider from 'providers/areas-provider';
import CountryDataProvider from 'providers/country-data-provider';
import MyGFWProvider from 'providers/mygfw-provider';
import LocationProvider from 'providers/location-provider';

import MyGfwHeader from './components/header';
import Areas from './components/areas';

const MyGfwPage = ({ loggedIn, loggingIn }) => (
  <div className="l-my-gfw-page">
    <MyGFWProvider />
    {!loggingIn && !loggedIn && (
      <Row className="login">
        <Column width={[0, 1 / 12, 1 / 6]} />
        <Column width={[1, 5 / 6, 2 / 3]}>
          <LoginForm />
        </Column>
      </Row>
    )}
    {loggingIn && (
      <Row>
        <Column>
          <Loader />
        </Column>
      </Row>
    )}
    {loggedIn && (
      <Fragment>
        <MyGfwHeader />
        <LocationProvider />
        <Areas />
        <AreasProvider />
        <CountryDataProvider />
        <AreaOfInterestModal canDelete />
        <ShareModal />
      </Fragment>
    )}
  </div>
);

MyGfwPage.propTypes = {
  loggedIn: PropTypes.bool,
  loggingIn: PropTypes.bool,
};

export default MyGfwPage;
