import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ news }) => ({
  data: news && news.data
});

class NewsProvider extends PureComponent {
  componentDidMount() {
    const { getNews, data } = this.props;
    if (isEmpty(data)) {
      getNews();
    }
  }

  render() {
    return null;
  }
}

NewsProvider.propTypes = {
  data: PropTypes.array,
  getNews: PropTypes.func.isRequired
};

reducerRegistry.registerModule('news', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(NewsProvider);
