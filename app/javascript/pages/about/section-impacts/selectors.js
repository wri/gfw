import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

export const allProjectsCategory = 'All';

const getProjects = (state) => state.data;
const getCategory = (state) => state.categorySelected;
const getSearch = (state) => state.search;

export const getProjectList = createSelector(
  getProjects,
  (projects) => projects
);
export const getCategoriesList = createSelector(getProjectList, (projects) => {
  const categoriesList = uniq(projects.map((c) => c.category));
  return [allProjectsCategory, ...categoriesList];
});

export const getProjectsByCategory = createSelector(
  getProjectList,
  (projects) => {
    if (!projects) return null;
    const grouped = groupBy(projects, 'category');
    grouped[allProjectsCategory] = projects;
    return grouped;
  }
);

export const getCategorySelected = createSelector(
  getCategory,
  (category) => category || allProjectsCategory
);

export const getProjectsSelected = createSelector(
  [getProjectsByCategory, getCategorySelected, getSearch],
  (projects, category, search) => {
    if (!projects || !category) return null;
    if (!search) return projects[category];
    return projects[category].filter(
      (p) => deburrUpper(p.title).indexOf(deburrUpper(search)) > -1
    );
  }
);

export default {
  getProjectList,
  getProjectsByCategory,
  getSearch,
};
