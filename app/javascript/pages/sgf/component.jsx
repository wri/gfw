import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Projects from 'pages/sgf/section-projects';
import About from 'pages/sgf/section-about';
import Apply from 'pages/sgf/section-apply';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';

import bgImage from './header-bg';
import './styles.scss';

const sectionComponents = {
  projects: Projects,
  about: About,
  apply: Apply
};

class Page extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { section } = this.props;
    const SectionComponent =
      sectionComponents[(section && section.component) || 'projects'];
    return (
      <div>
        <Cover
          title="Grants & Fellowships"
          description="The Small Grants Fund and Tech Fellowship support civil society organizations
            and individuals around the world to use Global Forest Watch in their advocacy,
            research, and feld work."
          bgImage={bgImage}
        />
        <SubnavMenu links={this.props.links} />
        <div className="l-sgf-page">
          <SectionComponent />
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  section: PropTypes.object.isRequired,
  links: PropTypes.array.isRequired
};

export default Page;
