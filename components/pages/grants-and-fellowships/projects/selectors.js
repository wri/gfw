import { createSelector, createStructuredSelector } from 'reselect';
import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import compact from 'lodash/compact';
import sortBy from 'lodash/sortBy';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

const getProjects = (state) => state.projects;
const getCategory = (state) => state.category;
const getSearch = (state) => state.search;
const getLatLngs = (state) => state.latLngs;
const getImages = (state) => state.images;
const getCustomFilter = (state) => state.customFilter;

const getProjectsWithImages = createSelector(
  [getProjects, getImages],
  (projects, images) => {
    if (!projects || !projects.length || !images) return null;
    return projects.map((p) => {
      const imagesArray =
        images[p.imageKey] && images[p.imageKey].map((i) => i.url);
      return {
        ...p,
        image: imagesArray && imagesArray[0],
        images: imagesArray,
      };
    });
  }
);

const getCategories = createSelector(getProjects, (projects) => {
  if (!projects || !projects.length) return null;
  return [
    'All',
    ...sortBy(compact(uniq(flatten(projects.map((p) => p.categories))))),
  ];
});

const getProjectsByCategory = createSelector(
  [getProjectsWithImages, getCategories],
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
  [
    getProjectsWithImages,
    getProjectsByCategory,
    getCategory,
    getSearch,
    getCustomFilter,
  ],
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

// A project may belong to many countries, we need a globe entry for each
const getProjectsForGlobe = createSelector(
  [getProjectsList, getCategories, getLatLngs],
  (projects, categories, latLngs) => {
    if (!projects || !categories) return null;
    let projectsForGlobe = [];
    projects.forEach((p) => {
      let tempCountries = [];
      const countries = p.countries && p.countries.split(',');
      if (countries && countries.length > 1) {
        tempCountries = countries.map((iso) => ({
          ...p,
          iso,
        }));
      } else {
        tempCountries = [
          {
            ...p,
            iso: p.countries,
          },
        ];
      }
      projectsForGlobe = projectsForGlobe.concat(tempCountries);
    });

    return projectsForGlobe.map((p) => {
      const latLng = latLngs.find((l) => l.iso === p.iso);
      return {
        ...p,
        latitude: latLng && latLng.latitude_average,
        longitude: latLng && latLng.longitude_average,
      };
    });
  }
);

const getGlobeClusters = createSelector(
  [getProjectsForGlobe, getCustomFilter],
  (projects, filters) => {
    if (!projects || !projects.length || !filters) return null;

    const points = filters.length
      ? projects.filter((p) => filters.indexOf(p.id) > -1)
      : projects;
    const groupedByLocation = groupBy(points, 'iso');
    const mapPoints = Object.keys(groupedByLocation).map((iso) => ({
      iso,
      latitude: groupedByLocation[iso][0].latitude,
      longitude: groupedByLocation[iso][0].longitude,
      ...(!!groupedByLocation[iso].length && {
        cluster: groupedByLocation[iso],
      }),
    }));
    return mapPoints;
  }
);

export const getProjectsProps = createStructuredSelector({
  projects: getProjectsList,
  categories: getCategoriesList,
  globeData: getGlobeClusters,
});
