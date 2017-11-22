import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';

export const allProjectsCategory = 'All';

const getProjects = state => state.data || null;
const getCategory = state => state.categorySelected || null;

export const getProjectList = createSelector(getProjects, projects => projects);
export const getCategoriesList = createSelector(getProjectList, projects => {
  const categoriesList = uniq(projects.map(c => c.category));
  return [allProjectsCategory, ...categoriesList];
});

export const getProjectsByCategory = createSelector(
  getProjectList,
  projects => {
    if (!projects) return null;
    const grouped = groupBy(projects, 'category');
    grouped[allProjectsCategory] = projects;
    return grouped;
  }
);

export const getCategorySelected = createSelector(
  getCategory,
  category => category || allProjectsCategory
);

export const getProjectsSelected = createSelector(
  [getProjectsByCategory, getCategorySelected],
  (projects, category) => {
    if (!projects || !category) return null;
    return projects[category];
  }
);

export default {
  getProjectList,
  getProjectsByCategory
};
