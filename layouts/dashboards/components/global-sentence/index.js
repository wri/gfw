import { connect } from 'react-redux';

import GlobalSentenceComponent from './component';

import { getGlobalSentenceProps } from './selectors';

export default connect(getGlobalSentenceProps, {})(GlobalSentenceComponent);
