import { createSelector, createStructuredSelector } from 'reselect';

import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import sortBy from 'lodash/sortBy';

import { deburrUpper } from 'utils/strings';

const getProjects = (state) => state.projects;
const getCategory = (state) => state.category;
const getCountry = (state) => state.country;
const getSearch = (state) => state.search;

const getProjectsByCountry = createSelector(
  [getProjects, getCountry],
  (projects, country) => {
    if (!country) return projects;

    const countryFilter = (project) => {
      if (!country) return true;
      return project.countries.split(',').includes(country.toUpperCase());
    };

    return projects.filter(countryFilter);
  }
);

const getFilteredProjects = createSelector(
  [getProjectsByCountry, getCategory, getSearch],
  (projects, category, search) => {
    if (!projects) return null;

    const categoryFilter = (project) => {
      if (category === 'All') return true;
      return project.categories.includes(category);
    };

    const searchFilter = (project) => {
      if (!search) return true;
      return (
        deburrUpper(project.title).indexOf(deburrUpper(search)) > -1 ||
        deburrUpper(project.meta).indexOf(deburrUpper(search)) > -1 ||
        deburrUpper(project.summary).indexOf(deburrUpper(search)) > -1
      );
    };

    return projects.filter(categoryFilter).filter(searchFilter);
  }
);

const getCountriesList = createSelector(getProjects, (projects) => {
  if (!projects?.length) return null;
  return uniq(
    flatten(projects.map((p) => p.countries.split(',').map((c) => c.trim())))
  );
});

const getCategories = createSelector(getProjectsByCountry, (projects) => {
  if (!projects?.length) return null;
  return [
    'All',
    ...sortBy(compact(uniq(flatten(projects.map((p) => p.categories))))),
  ];
});

const getFilteredProjectsByCategory = createSelector(
  [getProjectsByCountry, getCategories],
  (projects, categories) => {
    if (!projects || !categories) return null;
    const projectsByCategory = {};
    categories.forEach((c) => {
      projectsByCategory[c] =
        c === 'All'
          ? projects
          : projects.filter((p) => p.categories.indexOf(c) > -1);
    });

    return projectsByCategory;
  }
);

const getCategoriesList = createSelector(
  [getFilteredProjectsByCategory],
  (projects) => {
    if (!projects) return null;

    return Object.keys(projects).map((c) => ({
      label: c,
      count: projects[c].length,
    }));
  }
);

export const getProjectsProps = createStructuredSelector({
  projects: getFilteredProjects,
  categories: getCategoriesList,
  countries: getCountriesList,
});
