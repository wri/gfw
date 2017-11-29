import { createSelector } from 'reselect';

// get list data
const getAdmins = state => state.location || null;
const getAdminLists = state => state.adminData || null;

export const getAdminsSelected = createSelector(
  [getAdminLists, getAdmins],
  (adminLists, adminsSelected) => ({
    country:
      (adminLists.countries &&
        adminLists.countries.find(i => i.value === adminsSelected.country)) ||
      null,
    region:
      (adminLists.regions &&
        adminLists.regions.find(i => i.value === adminsSelected.region)) ||
      null,
    subRegion:
      (adminLists.subRegions &&
        adminLists.subRegions.find(
          i => i.value === adminsSelected.subRegion
        )) ||
      null
  })
);

export default {
  getAdminsSelected
};
