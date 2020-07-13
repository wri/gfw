import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';

const getProjects = (state) => state.data;
const getCategory = (state) => state.categorySelected;

export const getProjectsByCategory = createSelector(getProjects, (projects) => {
  if (!projects) return null;
  return groupBy(projects, 'category');
});

export const getCategoriesList = createSelector(
  getProjectsByCategory,
  (projects) => {
    if (!projects) return null;
    const categories = Object.keys(projects).map((c) => ({
      label: c,
      count: projects[c].length,
    }));
    return [{ label: 'All', count: projects.length }, ...categories];
  }
);

export const getProjectsSelected = createSelector(
  [getProjects, getProjectsByCategory, getCategory],
  (allProjects, groupedProjects, category) => {
    if (!allProjects || !category) return null;
    if (category === 'All') return allProjects;
    return groupedProjects[category];
  }
);

export default {
  getProjectsSelected,
  getCategoriesList,
};
