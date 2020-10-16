import { connect } from 'react-redux';

import { setMapSettings } from 'components/map/actions';

import Component from './component';
import { getArticleCardProps } from './selectors';

export default connect(getArticleCardProps, { setMapSettings })(Component);
