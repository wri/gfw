import { connect } from 'react-redux';

import { setMapBasemap } from 'components/map/actions';
import { setMainMapSettings } from 'layouts/map/actions';
import { setModalMetaSettings } from 'components/modals/meta/actions';

import { getBasemapProps } from './selectors';

import Component from './component';

export default connect(getBasemapProps, {
  setMainMapSettings,
  setMapBasemap,
  setModalMetaSettings,
})(Component);
