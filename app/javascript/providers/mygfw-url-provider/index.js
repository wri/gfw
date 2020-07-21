import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Url from 'components/url';

import selectMapParams from './selectors';

const MyGfwUrlProvider = ({ urlParams }) => <Url queryParams={urlParams} />;

MyGfwUrlProvider.propTypes = {
  urlParams: PropTypes.object,
};

export default connect(selectMapParams)(MyGfwUrlProvider);
