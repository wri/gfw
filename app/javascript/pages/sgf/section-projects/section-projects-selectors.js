import { createSelector } from 'reselect';
import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

const getProjects = state => state.data || null;
const getCategory = state => state.categorySelected || null;
const getSearch = state => state.search || null;

export const getCategories = createSelector(getProjects, projects => {
  if (!projects) return null;
  return sortBy(uniq(flatten(projects.map(p => p.categories))).filter(i => i));
});

export const getProjectsByCategory = createSelector(
  [getProjects, getCategories],
  (projects, categories) => {
    if (!projects || !categories) return null;
    const projectsByCategory = {};
    categories.forEach(c => {
      projectsByCategory[c] = projects.filter(
        p => p.categories.indexOf(c) > -1
      );
    });
    return projectsByCategory;
  }
);

export const getCategoriesList = createSelector(
  getProjectsByCategory,
  projects => {
    if (!projects) return null;
    const categories = Object.keys(projects).map(c => ({
      label: c,
      count: projects[c].length
    }));
    return [{ label: 'All', count: projects.length }, ...categories];
  }
);

export const getProjectsSelected = createSelector(
  [getProjects, getProjectsByCategory, getCategory, getSearch],
  (allProjects, groupedProjects, category, search) => {
    if (!allProjects || !category) return null;
    const projects =
      category === 'All' ? allProjects : groupedProjects[category];
    if (!search) return projects;
    return projects.filter(
      p => deburrUpper(p.title).indexOf(deburrUpper(search)) > -1
    );
  }
);

export default {
  getProjectsSelected,
  getCategoriesList,
  getSearch
};
