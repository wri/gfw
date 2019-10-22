import { connect } from 'react-redux';

import { setModalNewsletterOpen } from 'components/modals/newsletter/actions';
import * as actions from 'components/modals/video/video-actions';
import PageComponent from './component';

import config from './config';

const mapStateToProps = ({ news }) => ({
  news: news && news.data,
  newsLoading: news && news.loading,
  ...config
});

export default connect(mapStateToProps, { ...actions, setModalNewsletterOpen })(
  PageComponent
);
