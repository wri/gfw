import { connect } from 'react-redux';
import { selectActiveLang } from 'utils/lang';

import Component from './component';

export default connect((state) => ({
  lang: selectActiveLang(state),
}))(Component);
