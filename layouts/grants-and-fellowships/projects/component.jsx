import { Fragment, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Search, NoContent, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';
import Dropdown from 'components/ui/dropdown';
import TagsList from 'components/tags-list';

import CountryDataProvider from 'providers/country-data-provider';

import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

const GrantsProjectsSection = ({
  projects: allProjects,
  images,
  countries: allCountries,
}) => {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const {
    query: { modal, projectId },
    replace,
    asPath,
  } = useRouter();

  const { projects, categories, countries } = useMemo(
    () =>
      getProjectsProps({
        projects: allProjects,
        images,
        search,
        category,
        country,
      }),
    [allProjects, images, search, category, country]
  );

  const selectedProject = useMemo(
    () => projects?.find((p) => p.id === parseInt(projectId || modal, 10)),
    [projects, projectId, modal]
  );

  const countryOptions = useMemo(
    () => allCountries?.filter(({ value }) => countries.includes(value)),
    [allCountries, countries]
  );

  const tags = useMemo(
    () =>
      categories?.map(({ label, count }) => ({
        id: label,
        name: `${label} (${count})`,
        active: label === category,
      })) || [],
    [categories, category]
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
          <Column className="project-filters">
            <span className="filters-label">Filter by country</span>
            <Dropdown
              options={[{ label: 'All', value: '' }, ...countryOptions]}
              value={country}
              onChange={setCountry}
              native
            />
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

          {!projects?.length && (
            <NoContent
              className="no-projects"
              message="No projects for that search"
            />
          )}
        </Row>
      </div>
      <ProjectsModal
        open={!!selectedProject}
        data={selectedProject}
        onRequestClose={() => replace(asPath?.split('?')?.[0])}
      />
      <CountryDataProvider />
    </Fragment>
  );
};

GrantsProjectsSection.propTypes = {
  countries: PropTypes.array,
  projects: PropTypes.array,
  images: PropTypes.object,
};

export default GrantsProjectsSection;
