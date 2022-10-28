import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Search, NoContent, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';
import TagsList from 'components/tags-list';

import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

const GrantsProjectsSection = ({ projects: allProjects, images }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const props = getProjectsProps({
    projects: allProjects,
    images,
    search,
    category,
  });

  const { projects, categories } = props || {};

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

  const tags = categories?.map(({ label, count }) => ({
    id: label,
    name: `${label} (${count})`,
    active: label === category,
  }));

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
        <Row className="project-categories-search">
          <Column width={[1, 1 / 2, 2 / 3]} className="project-categories">
            <TagsList title="Categories" tags={tags} onClick={setCategory} />
          </Column>
          <Column width={[1, 1 / 2, 1 / 3]}>
            <Search placeholder="Search" input={search} onChange={setSearch} />
          </Column>
        </Row>
        <Row className="project-cards">
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
