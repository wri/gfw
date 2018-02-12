import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';

import bgImage from './header-bg';
import './page-styles.scss';

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    const SectionComponent = this.props.section;
    return (
      <div>
        <Cover
          title="Small Grants Fund"
          description="The Small Grants Fund supports civil society organizations around the world to use GFW in their research, advocacy and fieldwork"
          bgImage={bgImage}
        />
        <SubnavMenu links={this.props.links} />
        <div className="l-main">
          <SectionComponent />
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  section: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired
};

export default Page;
