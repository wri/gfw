export const initialState = {
  isLoading: true,
  totalAmount: 0,
  percentage: 0,
  regions: [
    {
      label: 'Plantations',
      value: 'plantations'
    },
    {
      label: 'Managed',
      value: 'managed'
    },
    {
      label: 'Protected Areas',
      value: 'protected_areas'
    },
    {
      label: 'Intact Forest Landscapes',
      value: 'intact_forest_landscapes'
    },
    {
      label: 'Primary Forest',
      value: 'primary_forest'
    },
    {
      label: 'Mangroves',
      value: 'mangroves'
    },
    {
      label: 'Moratorium Areas',
      value: 'moratorium_areas'
    }
  ],
  settings: {
    region: 'All',
  }
};

const setTreeCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalAmount: payload.totalAmount,
  percentage: payload.percentage,
});

export default {
  setTreeCoverGainValues
};
