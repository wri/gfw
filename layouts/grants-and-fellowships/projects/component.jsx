import { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Element as ScrollEl, scroller } from 'react-scroll';
import { useRouter } from 'next/router';

import { Search, NoContent, Desktop, Row, Column } from 'gfw-components';

import Globe from 'components/globe';
import Button from 'components/ui/button';
import Card from 'components/ui/card';
import ItemsList from 'components/items-list';

import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

function getPaginatedData(data, pagination) {
  if (data.length === pagination.items) {
    return data;
  }
  return data.slice(0, pagination.items);
}

const GrantsProjectsSection = ({ projects: allProjects, images, latLngs }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [customFilter, setCustomFilter] = useState([]);

  const [paginate, setPaginate] = useState({ items: 6, offset: 6, page: 1 });
  const [paginatedProjects, setPaginatedProjects] = useState([]);

  useEffect(() => {
    setPaginatedProjects(getPaginatedData(allProjects, paginate));
  }, [paginate]);

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
    query: { sgfModal, projectId },
    replace,
    asPath,
  } = useRouter();
  const selectedProject = projects?.find(
    (p) => p.id === parseInt(projectId || sgfModal, 10)
  );

  const setModalOpen = (id) =>
    replace(`${asPath.split('?')?.[0]}?projectId=${id}`);
  const handleSetCategory = (cat) => {
    setCategory(cat);
    setCustomFilter([]);
  };

  const handleGlobeClick = (d) => {
    if (!d?.cluster || d?.cluster?.length === 1) {
      const id = d?.id || (d?.cluster && d?.cluster?.[0]?.id);
      setModalOpen(id);
    } else {
      const projectIds = d.cluster.map((p) => p?.id);
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
      <div className="l-grants-projects-section">
        <Row>
          <Column width={[1, 7 / 12]} className="project-globe">
            <Desktop>
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
            </Desktop>
          </Column>
          <Column width={[1, 5 / 12]} className="side">
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
          </Column>
        </Row>
        <Row>
          <Column width={[0, 1 / 2, 2 / 3]} />
          <Column width={[1, 1 / 2, 1 / 3]}>
            <Search
              className="project-search"
              placeholder="Search"
              input={search}
              onChange={setSearch}
            />
          </Column>
        </Row>
        <ScrollEl name="project-cards" className="project-cards">
          <Row>
            {paginatedProjects?.map((d) => {
              const isFellow = d?.categories?.includes('Fellow');

              return (
                <Column
                  key={d.id}
                  width={[1, 1 / 2, 1 / 3]}
                  className="card-container"
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
                </Column>
              );
            })}
          </Row>
          <Button
            className="load-more"
            onClick={() =>
              setPaginate({
                ...paginate,
                items: paginate.items + paginate.offset,
              })}
          >
            Load more projects
          </Button>
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

GrantsProjectsSection.propTypes = {
  projects: PropTypes.array,
  images: PropTypes.object,
  latLngs: PropTypes.array,
};

export default GrantsProjectsSection;
