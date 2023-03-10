import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import ReactHtmlParser from 'react-html-parser';

import Projects from 'layouts/grants-and-fellowships/projects';
import About from 'layouts/grants-and-fellowships/about';
import Apply from 'layouts/grants-and-fellowships/apply';

import Cover from 'components/cover';
import SubnavMenu from 'components/subnav-menu';

import bgImage from './background.jpg';
// import './styles.scss';

const GRANTS_PAGE_COMPONENTS = {
  projects: Projects,
  about: About,
  apply: Apply,
};

const GrantsAndFellowshipsPage = (props) => {
  const SectionComponent = GRANTS_PAGE_COMPONENTS[props?.section];
  const links = Object.keys(GRANTS_PAGE_COMPONENTS).map((key) => ({
    label: capitalize(key),
    href: '/grants-and-fellowships/[section]',
    as: `/grants-and-fellowships/${key}`,
    activeShallow: key === props?.section,
  }));

  return (
    <div>
      <Cover
        title={ReactHtmlParser(props?.header?.title?.rendered)}
        description={ReactHtmlParser(props?.header?.acf?.header_description)}
        bgImage={bgImage}
      />
      <SubnavMenu links={links} />
      <div className="l-grants-page">
        {SectionComponent && <SectionComponent {...props} />}
      </div>
    </div>
  );
};

GrantsAndFellowshipsPage.propTypes = {
  header: PropTypes.object,
  section: PropTypes.string,
};

export default GrantsAndFellowshipsPage;
