import { connect } from 'react-redux';
import { selectActiveLang } from 'app/layouts/root/selectors';

import Component from './component';

export default connect(state => ({
  lang: selectActiveLang(state)
}))(Component);
