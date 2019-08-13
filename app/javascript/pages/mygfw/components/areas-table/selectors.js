import { createStructuredSelector } from 'reselect';
import { getTags } from 'components/map-menu/components/sections/my-gfw/selectors';

const selectAreas = state => state.areas && state.areas.data;

export const getAreasTableProps = createStructuredSelector({
  areas: selectAreas,
  tags: getTags
});
