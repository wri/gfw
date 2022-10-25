import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Element as ScrollEl } from 'react-scroll';
import { useRouter } from 'next/router';

import { Search, NoContent, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';

import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

const GrantsProjectsSection = ({ projects: allProjects, images }) => {
  const [search, setSearch] = useState('');

  const props = getProjectsProps({
    projects: allProjects,
    images,
    search,
  });

  const { projects } = props || {};
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

  return (
    <Fragment>
      <div className="l-grants-projects-section">
        <Row className="projects-header">
          <Column width={[1]}>
            <h3>MEET THE GRANTEES AND FELLOWS</h3>
            <p className="text -paragraph -color-2 -light -spaced">
              With financial and technical support from GFW, organizations and
              individuals around the world are using Global Forest Watch to
              monitor large-scale land-use projects, enforce community land
              rights, defend critical habitat, and influence forest policy.
            </p>
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
            {projects?.map((d) => {
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
};

export default GrantsProjectsSection;
