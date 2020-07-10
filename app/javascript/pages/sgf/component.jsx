import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import Projects from 'pages/sgf/section-projects';
import About from 'pages/sgf/section-about';
import Apply from 'pages/sgf/section-apply';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';

import bgImage from './header-bg.jpg?webp';
import './styles.scss';

const sections = {
  projects: Projects,
  about: About,
  apply: Apply,
};

class GrantsAndFellowshipsPage extends PureComponent {
  static propTypes = {
    section: PropTypes.string,
  };

  render() {
    const { section } = this.props;
    const SectionComponent = sections[section || 'projects'];
    const links = Object.keys(sections).map((key) => ({
      label: capitalize(key),
      href: '/grants-and-fellowships/[section]',
      as: `/grants-and-fellowships/${key}`,
      activeShallow: !section && key === 'projects',
    }));

    return (
      <div>
        <Cover
          title="Grants & Fellowships"
          description="The Small Grants Fund and Tech Fellowship support civil society organizations
            and individuals around the world to use Global Forest Watch in their advocacy,
            research, and feld work."
          bgImage={bgImage}
        />
        <SubnavMenu links={links} />
        <div className="l-sgf-page">
          {SectionComponent && <SectionComponent />}
        </div>
      </div>
    );
  }
}

export default GrantsAndFellowshipsPage;
