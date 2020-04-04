import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MyGFW from 'layouts/my-gfw';

class MyGFWPage extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return <MyGFW {...this.props} />;
  }
}

export default MyGFWPage;
