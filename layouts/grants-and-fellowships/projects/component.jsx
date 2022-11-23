import { Fragment, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import omitBy from 'lodash/omitBy';
import { Search, NoContent, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';
import Dropdown from 'components/ui/dropdown';
import TagsList from 'components/tags-list';

import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

import './styles.scss';

const GrantsProjectsSection = ({
  projects: allProjects,
  images,
  countries: allCountries,
  country: countryQueryParam,
}) => {
  const [country, setCountry] = useState(countryQueryParam);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { query, replace, asPath } = useRouter();

  const { modal, projectId, country: countryIso } = query;

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
    () => [
      { label: 'All', value: '' },
      ...allCountries
        ?.filter(({ iso }) => countries.includes(iso))
        .map(({ iso, name }) => ({ label: name, value: iso })),
    ],
    [allCountries, countries]
  );

  const tags = useMemo(
    () =>
      categories?.map(({ label }) => ({
        id: label,
        name: label,
        active: label === category,
      })) || [],
    [categories, category]
  );

  useEffect(() => setCountry(countryIso), [countryIso, setCountry]);

  useEffect(() => {
    if (!categories.map(({ label }) => label).includes(category)) {
      setCategory('All');
    }
  }, [country]);

  const setQueryParams = (params) => {
    const queryParams = omitBy(
      { ...query, section: null, ...params },
      (value) => !value
    );

    replace(
      {
        pathname: asPath.split('?')[0],
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCountrySelected = (option) => {
    setQueryParams({ country: option });
  };

  const setModalOpen = (id) => {
    setQueryParams({ projectId: id });
  };

  const handleModalClose = () => {
    setQueryParams({ projectId: null });
  };

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
              className="countries-dropdown"
              theme="theme-dropdown-native"
              options={countryOptions}
              value={country}
              onChange={handleCountrySelected}
              clearable
              searchable
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
        onRequestClose={handleModalClose}
      />
    </Fragment>
  );
};

GrantsProjectsSection.propTypes = {
  country: PropTypes.string,
  countries: PropTypes.array,
  projects: PropTypes.array,
  images: PropTypes.object,
};

export default GrantsProjectsSection;
