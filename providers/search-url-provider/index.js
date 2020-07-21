import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Url from 'components/url';

import selectMapParams from './selectors';

const SearchUrlProvider = ({ urlParams }) => <Url queryParams={urlParams} />;

SearchUrlProvider.propTypes = {
  urlParams: PropTypes.object,
};

export default connect(selectMapParams)(SearchUrlProvider);
