import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import Projects from 'components/pages/sgf/section-projects';
import About from 'components/pages/sgf/section-about';
import Apply from 'components/pages/sgf/section-apply';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';

import bgImage from './header-bg.jpg?webp';
import './styles.scss';

const PAGE_COMPONENTS = {
  projects: Projects,
  about: About,
  apply: Apply,
};

const GrantsAndFellowshipsPage = (props) => {
  const SectionComponent = PAGE_COMPONENTS[props?.section];
  const links = Object.keys(PAGE_COMPONENTS).map((key) => ({
    label: capitalize(key),
    href: '/grants-and-fellowships/[section]',
    as: `/grants-and-fellowships/${key}`,
    activeShallow: key === props?.section,
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
        {SectionComponent && <SectionComponent {...props} />}
      </div>
    </div>
  );
};

GrantsAndFellowshipsPage.propTypes = {
  section: PropTypes.string,
};

export default GrantsAndFellowshipsPage;
