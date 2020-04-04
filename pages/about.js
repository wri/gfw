import { PureComponent } from 'react';

import Layout from 'layouts/page';
import About from 'layouts/about';

class AboutPage extends PureComponent {
  render() {
    return (
      <Layout {...this.props}>
        <About />
      </Layout>
    );
  }
}

export default AboutPage;
