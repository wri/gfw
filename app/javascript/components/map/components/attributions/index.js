import { connect } from 'react-redux';

import { setModalAttributions } from 'components/modals/attributions/actions';

import { getAttributionProps } from './selectors';

import Component from './component';

export default connect(getAttributionProps, { setModalAttributions })(
  Component
);
