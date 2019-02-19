import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// import Projects from 'pages/sgf/section-projects';
// import About from 'pages/sgf/section-about';
// import Apply from 'pages/sgf/section-apply';

import Cover from 'components/cover';
// import SubnavMenu from 'components/subnav-menu';

import bgImage from './header-bg';
import './styles.scss';

// const sectionComponents = {
//   projects: Projects,
//   about: About,
//   apply: Apply
// };

class Page extends PureComponent {
  render() {
    // const { section } = this.props;
    // const SectionComponent = sectionComponents[(section && section.component) || 'projects'];
    return (
      <div>
        <Cover
          title="Topics"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat."
          bgImage={bgImage}
        />
        {/* <SubnavMenu links={this.props.links} /> */}
        <div className="l-main">
          {/* <SectionComponent /> */}
          <div>Here goes biodiversity stuff</div>
        </div>
      </div>
    );
  }
}

// Page.propTypes = {
//    section: PropTypes.object.isRequired,
//    links: PropTypes.array.isRequired
// };

export default Page;
