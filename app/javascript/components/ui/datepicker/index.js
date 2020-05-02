import { connect } from 'react-redux';
import { selectActiveLang } from 'utils/lang';

import Component from './datepicker-component';

const mapStateToProps = (state) => ({
  lang: selectActiveLang(state),
});

export default connect(mapStateToProps)(Component);
