import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// import Projects from 'pages/sgf/section-projects';
// import About from 'pages/sgf/section-about';
// import Apply from 'pages/sgf/section-apply';

import Cover from 'components/cover';
import Footer from 'components/footer';
import Header from 'components/header';
import SubnavMenu from 'components/subnav-menu';

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
    const links = [
      { label: 'Biodiversity', path: '/topics/biodiversity' },
      { label: 'Commodities', path: '/topics/commodities' },
      { label: 'Water', path: '/topics/water' },
      { label: 'Climate', path: '/topics/climate' }
    ];
    return (
      <div>
        <Header />
        <Cover
          title="Topics"
          description="Explore the relationship between forests and several key themes critical to sustainability and the health of our
          future ecosystems."
          bgImage={bgImage}
        />
        <SubnavMenu links={links} />
        <div className="l-main">
          {/* <SectionComponent /> */}
          <div>Here goes biodiversity stuff</div>
        </div>
        <Footer />
      </div>
    );
  }
}

// Page.propTypes = {
//    section: PropTypes.object.isRequired,
//    links: PropTypes.array.isRequired
// };

export default Page;
