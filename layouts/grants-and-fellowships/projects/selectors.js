import { createSelector, createStructuredSelector } from 'reselect';

import { deburrUpper } from 'utils/strings';

const getProjects = (state) => state.projects;
const getSearch = (state) => state.search;
const getCustomFilter = (state) => state.customFilter;

const getProjectsList = createSelector(
  [getProjects, getSearch, getCustomFilter],
  (projects, search, filter) => {
    if (!projects) return null;
    if (filter && filter.length) {
      return projects.filter((p) => filter.indexOf(p.id) > -1);
    }
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
});
