import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Element as ScrollEl, scroller } from 'react-scroll';
import { useRouter } from 'next/router';

import Globe from 'components/globe';
import Card from 'components/ui/card';
import ItemsList from 'components/items-list';
import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';

import { Media } from 'utils/responsive';

import ProjectsModal from './section-projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

const SectionProjects = ({ projects: allProjects, images, latLngs }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [customFilter, setCustomFilter] = useState([]);

  const props = getProjectsProps({
    projects: allProjects,
    images,
    latLngs,
    search,
    category,
    customFilter,
  });

  const { projects, categories, globeData } = props || {};
  const {
    query: { sgfModal },
    replace,
    asPath,
  } = useRouter();
  const selectedProject = projects?.find(
    (p) => p.id === parseInt(sgfModal, 10)
  );

  const setModalOpen = (id) =>
    replace(`${asPath.split('?')?.[0]}?sgfModal=${id}`);
  const handleSetCategory = (cat) => {
    setCategory(cat);
    setCustomFilter([]);
  };

  const handleGlobeClick = (d) => {
    if (!d?.cluster || d?.cluster?.length === 1) {
      const id = d.id || (d?.cluster && d?.cluster?.[0].id);
      setModalOpen(id);
    } else {
      const projectIds = d.cluster.map((p) => p.id);
      setCustomFilter(projectIds);
      scroller.scrollTo('project-cards', {
        duration: 800,
        smooth: true,
        offset: -50,
      });
    }
  };

  return (
    <Fragment>
      <div className="l-section-projects-sgf">
        <div className="row">
          <div className="column small-12 large-7 project-globe">
            <Media greaterThanOrEqual="lg">
              <ul className="tags">
                <li>
                  <span id="grants" /> 
                  {' '}
                  <p>Grantees</p>
                </li>
                <li>
                  <span id="fellows" /> 
                  {' '}
                  <p>Fellows</p>
                </li>
              </ul>
              <Globe
                autorotate={false}
                data={globeData}
                onClick={handleGlobeClick}
              />
            </Media>
          </div>
          <div className="column small-12 large-5 side">
            <h3>MEET THE GRANTEES AND FELLOWS</h3>
            <p className="text -paragraph -color-2 -light -spaced">
              With financial and technical support from GFW, organizations and
              individuals around the world are using Global Forest Watch to
              monitor large-scale land-use projects, enforce community land
              rights, defend critical habitat, and influence forest policy.
            </p>
            {categories?.length && (
              <ItemsList
                className="project-list"
                data={categories}
                itemSelected={category}
                onClick={handleSetCategory}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6 large-4 medium-offset-6 large-offset-8">
            <Search
              className="project-search"
              placeholder="Search"
              input={search}
              onChange={setSearch}
            />
          </div>
        </div>
        <ScrollEl name="project-cards" className="row project-cards">
          {projects?.map((d) => {
            const isFellow = d?.categories?.includes('Fellow');

            return (
              <div
                key={d.id}
                className="column small-12 medium-6 large-4 card-container"
              >
                <Card
                  className="project-card"
                  data={{
                    ...d,
                    tag: isFellow ? 'fellow' : 'grantee',
                    tagColor: isFellow ? '#f88000' : '#97bd3d',
                    buttons: [
                      {
                        className: 'read-more',
                        text: 'READ MORE',
                        onClick: () => setModalOpen(d.id),
                      },
                    ],
                  }}
                />
              </div>
            );
          })}
          {!projects?.length && (
            <NoContent
              className="no-projects"
              message="No projects for that search"
            />
          )}
        </ScrollEl>
      </div>
      <ProjectsModal
        open={!!selectedProject}
        data={selectedProject}
        onRequestClose={() => replace(asPath?.split('?')?.[0])}
      />
    </Fragment>
  );
};

SectionProjects.propTypes = {
  projects: PropTypes.array,
  images: PropTypes.object,
  latLngs: PropTypes.array,
};

export default SectionProjects;
