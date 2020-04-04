import { PureComponent } from 'react';

import Layout from 'layouts/page';
import Topics from 'layouts/topics';

class TopicPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <Topics />
      </Layout>
    );
  }
}

export default TopicPage;
