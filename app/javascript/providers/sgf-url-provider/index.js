import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Url from 'components/url';

import selectMapParams from './selectors';

const SgfUrlProvider = ({ urlParams }) => <Url queryParams={urlParams} />;

SgfUrlProvider.propTypes = {
  urlParams: PropTypes.object,
};

export default connect(selectMapParams)(SgfUrlProvider);
