import { connect } from 'react-redux';

import { setMapSettings, setMapBasemap } from 'components/map/actions';

import { getBasemapProps } from './selectors';

import Component from './component';

export default connect(getBasemapProps, { setMapSettings, setMapBasemap })(
  Component
);
