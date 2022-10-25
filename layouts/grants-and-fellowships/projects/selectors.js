import { createSelector, createStructuredSelector } from 'reselect';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import sortBy from 'lodash/sortBy';

import { deburrUpper } from 'utils/strings';

const getProjects = (state) => state.projects;
const getCategory = (state) => state.category;
const getSearch = (state) => state.search;
const getCustomFilter = (state) => state.customFilter;

const getCategories = createSelector(getProjects, (projects) => {
  if (!projects?.length) return null;
  return [
    'All',
    ...sortBy(compact(uniq(flatten(projects.map((p) => p.categories))))),
  ];
});

const getProjectsByCategory = createSelector(
  [getProjects, getCategories],
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
  [getProjectsByCategory],
  (projects) => {
    if (!projects) return null;

    return Object.keys(projects).map((c) => ({
      label: c,
      count: projects[c].length,
    }));
  }
);

const getProjectsList = createSelector(
  [getProjects, getProjectsByCategory, getCategory, getSearch, getCustomFilter],
  (allProjects, groupedProjects, category, search, filter) => {
    if (!allProjects || !category) return null;
    if (filter && filter.length) {
      return allProjects.filter((p) => filter.indexOf(p.id) > -1);
    }
    const projects =
      category === 'All' ? allProjects : groupedProjects[category];
    if (!search) return projects;
    return projects.filter(
      (p) =>
        deburrUpper(p.title).indexOf(deburrUpper(search)) > -1 ||
        deburrUpper(p.meta).indexOf(deburrUpper(search)) > -1 ||
        deburrUpper(p.summary).indexOf(deburrUpper(search)) > -1
    );
  }
);

export const getProjectsProps = createStructuredSelector({
  projects: getProjectsList,
  categories: getCategoriesList,
});
