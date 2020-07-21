import { connect } from 'react-redux';
import { selectActiveLang } from 'layouts/page/selectors';

import Component from './component';

const mapStateToProps = (state) => ({
  lang: selectActiveLang(state)
});

export default connect(mapStateToProps)(Component);
