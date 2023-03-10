import { Fragment, useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import omitBy from 'lodash/omitBy';
import orderBy from 'lodash/orderBy';
import debounce from 'lodash/debounce';

import { Search, NoContent, Row, Column } from 'gfw-components';

import Card from 'components/ui/card';
import Dropdown from 'components/ui/dropdown';
import TagsList from 'components/tags-list';
import LoadMoreButton from 'components/load-more';

import { getSGFProjects } from 'services/projects';
import ProjectsModal from './projects-modal';
import { getProjectsProps } from './selectors';

// import './styles.scss';

const GrantsProjectsSection = ({
  projects: allProjects,
  projectsTexts,
  images,
  allCountries,
  country: countryQueryParam,
  projectCountries,
  totalPages,
}) => {
  const [projectsList, setProjects] = useState(allProjects);
  const [country, setCountry] = useState(countryQueryParam);
  const [category, setCategory] = useState('All');
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoadMoreVisible, setLoadMoreVisibility] = useState(true);

  const { query, replace, asPath } = useRouter();
  const { modal, projectId, country: countryIso } = query;

  const getMoreProjects = useCallback(async (params) => {
    try {
      const { sgfProjects } = await getSGFProjects({ params });
      setLoading(false);

      return sgfProjects;
    } catch (error) {
      setLoading(false);
      setLoadMoreVisibility(false);

      return [];
    }
  }, []);

  const setMoreProjects = useCallback(
    (projectItems, itemSelected, itemToCompare = null) => {
      if (projectItems) {
        setProjects(projectItems);

        if (!itemSelected && !itemToCompare) {
          setLoadMoreVisibility(true);
          setPageNumber(1);
        }

        if (itemSelected !== '') {
          setLoadMoreVisibility(false);
        }
      }
    },
    []
  );

  const projectsListOrdered = useMemo(
    () => orderBy(projectsList, ['year', 'title'], ['desc', 'asc']),
    [projectsList]
  );

  const { projects, categories } = useMemo(
    () =>
      getProjectsProps({
        projects: projectsListOrdered,
        images,
        category,
        country,
      }),
    [projectsList, images, category, country]
  );

  const selectedProject = useMemo(
    () => projects?.find((p) => p.id === parseInt(projectId || modal, 10)),
    [projects, projectId, modal]
  );

  const countryOptions = useMemo(
    () => [
      { label: 'All', value: '' },
      ...allCountries
        .filter(({ iso }) => projectCountries.includes(iso))
        .map(({ iso, name }) => ({ label: name, value: iso })),
    ],
    [allCountries, projectCountries]
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

  useEffect(() => setCountry(countryIso), [countryIso]);

  useEffect(() => {
    if (!categories?.map(({ label }) => label).includes(category)) {
      setCategory('All');
    }
  }, [country]);

  useEffect(() => {
    const { country: countrySelected } = query;
    const isCountrySelectedOnFirstLoad = !!countrySelected;

    if (isCountrySelectedOnFirstLoad) {
      getMoreProjects({
        search: countrySelected,
        per_page: 100,
      }).then((projectItems) => setMoreProjects(projectItems, countrySelected));
    }
  }, []);

  const createParameters = (itemSelected, itemToCompare) => {
    let params = { search: itemSelected, per_page: 100 };

    if (itemSelected && itemToCompare) {
      params = Object.assign(params, {
        search: `${itemSelected} ${itemToCompare}`,
      });
    }

    if (!itemSelected && !itemToCompare) {
      params = Object.assign(params, { per_page: 21 });
    }

    if (!itemSelected && itemToCompare) {
      params = Object.assign(params, { search: itemToCompare });
    }

    return params;
  };

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

  const setModalOpen = (id) => {
    setQueryParams({ projectId: id });
  };

  const handleModalClose = () => {
    setQueryParams({ projectId: null });
  };

  const resetProjectsList = () => {
    setProjects([]);
    setLoading(true);
  };

  const handleCountrySelected = (option) => {
    const params = createParameters(searchKeyword, option);

    resetProjectsList();
    setQueryParams({ country: option });
    getMoreProjects(params).then((projectItems) =>
      setMoreProjects(projectItems, option, searchKeyword)
    );
  };

  const handleSearchOnChange = debounce((searchItem) => {
    const params = createParameters(searchItem, country);

    resetProjectsList();
    setSearchKeyword(searchItem);
    getMoreProjects(params).then((projectItems) => {
      setMoreProjects(projectItems, searchItem, country);
    });
  }, 1000);

  const handleOnLoadMore = debounce(() => {
    getMoreProjects({ page: pageNumber + 1, per_page: 21 }).then(
      (projectItems) => {
        if (projectItems) {
          setProjects([...projectsList, ...projectItems]);
          setPageNumber(pageNumber + 1);
        }

        if (pageNumber === totalPages - 1) {
          setLoadMoreVisibility(false);
        }
      }
    );
  }, 100);

  return (
    <Fragment>
      <div className="l-grants-projects-section">
        <Row className="projects-header">
          <Column width={[1]}>
            <h3>{projectsTexts?.projects_title}</h3>
            <p className="text -paragraph -color-2 -light -spaced">
              {projectsTexts?.projects_description}
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
            <Search
              placeholder="Search"
              onChange={handleSearchOnChange}
              onSubmit={handleSearchOnChange}
            />
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

          {!projects?.length && !isLoading && (
            <NoContent
              className="no-projects"
              message="No projects for that search"
            />
          )}
          <LoadMoreButton
            isLoading={isLoading}
            isVisible={isLoadMoreVisible}
            onClickHandle={handleOnLoadMore}
          />
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
  projectCountries: PropTypes.array,
  allCountries: PropTypes.array,
  projects: PropTypes.array,
  projectsTexts: PropTypes.object,
  images: PropTypes.object,
  totalPages: PropTypes.number,
};

export default GrantsProjectsSection;
