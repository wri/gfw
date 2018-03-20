import { createSelector } from 'reselect';
import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

const getProjects = state => state.data || null;
const getCategory = state => state.categorySelected || null;
const getSearch = state => state.search || null;
const getLatLngs = state => state.latLngs || null;
const getImages = state => state.images || null;

export const getProjectsWithImages = createSelector(
  [getProjects, getImages],
  (projects, images) => {
    if (!projects || !projects.length || !images) return null;
    return projects.map(p => ({
      ...p,
      image:
        images[p.imageKey] &&
        images[p.imageKey].length > 1 &&
        images[p.imageKey][1].url
    }));
  }
);

export const getCategories = createSelector(getProjectsWithImages, projects => {
  if (!projects || !projects.length) return null;
  return sortBy(uniq(flatten(projects.map(p => p.categories))).filter(i => i));
});

export const getProjectsForGlobe = createSelector(
  [getProjectsWithImages, getCategories, getLatLngs],
  (projects, categories, latLngs) => {
    if (!projects || !categories) return null;
    let projectsForGlobe = [];
    projects.forEach(p => {
      let tempCountries = [];
      const countries = p.countries.split(',');
      if (countries.length > 1) {
        tempCountries = countries.map(iso => ({
          ...p,
          iso
        }));
      } else {
        tempCountries = [
          {
            ...p,
            iso: p.countries
          }
        ];
      }
      projectsForGlobe = projectsForGlobe.concat(tempCountries);
    });
    return projectsForGlobe.map(p => {
      const latLng = latLngs.find(l => l.iso === p.iso);
      return {
        ...p,
        latitude: latLng && latLng.latitude_average,
        longitude: latLng && latLng.longitude_average
      };
    });
  }
);

export const getProjectsByCategory = createSelector(
  [getProjectsWithImages, getCategories],
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

export const getGlobeProjectsByCategory = createSelector(
  [getProjectsForGlobe, getCategories],
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
  [getProjectsWithImages, getProjectsByCategory, getCategory, getSearch],
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

export const getGlobeProjectsSelected = createSelector(
  [getProjectsForGlobe, getGlobeProjectsByCategory, getCategory, getSearch],
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

export const getGlobeClusters = createSelector(
  [getGlobeProjectsSelected],
  projects => {
    if (!projects || !projects.length) return null;
    const groupedByLocation = groupBy(projects, 'iso');
    const mapPoints = Object.keys(groupedByLocation).map(iso => ({
      iso,
      latitude: groupedByLocation[iso][0].latitude,
      longitude: groupedByLocation[iso][0].longitude,
      ...(!!groupedByLocation[iso].length && {
        cluster: groupedByLocation[iso]
      })
    }));
    return mapPoints;
  }
);

export default {
  getProjectsSelected,
  getCategoriesList,
  getSearch
};
