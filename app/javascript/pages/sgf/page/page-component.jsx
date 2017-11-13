import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from 'components/header/header';

import SubnavMenu from 'components/subnav-menu/subnav-menu';
// import styles from './page-styles.scss';

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const SectionComponent = this.props.section;
    return (
      <div>
        <Header />
        <SubnavMenu links={this.props.links} />
        <SectionComponent />
      </div>
    );
  }
}

Page.propTypes = {
  section: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired
};

export default Page;
