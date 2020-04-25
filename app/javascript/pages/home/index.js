import { connect } from 'react-redux';

import * as actions from 'components/modals/video/actions';
import PageComponent from './component';

import config from './config';

const mapStateToProps = ({ news }) => ({
  news: news?.data,
  newsLoading: news?.loading,
  ...config,
});

export default connect(mapStateToProps, actions)(PageComponent);
