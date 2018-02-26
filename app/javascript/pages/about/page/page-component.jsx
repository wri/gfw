import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';
import Projects from 'pages/about/section-projects';

import bgImage from './header-bg';
import './page-styles.scss';

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  render() {
    const { sections } = this.props;
    return (
      <div className="l-main">
        <Cover
          title="About"
          description="Global Forest Watch (GFW) is an online platform that provides data and tools for monitoring forests. By harnessing cutting-edge technology, GFW allows anyone to access near real-time information about where and how forests are changing around the world."
          bgImage={bgImage}
        />
        <SubnavMenu className="about-links" links={sections} />
        <Projects />
        {sections.map(s => (
          <div id={s.anchor} className={s.anchor} key={s.anchor}>
            {s.component && <s.component />}
          </div>
        ))}
      </div>
    );
  }
}

Page.propTypes = {
  sections: PropTypes.array.isRequired
};

export default Page;
