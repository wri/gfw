import { createAction, createThunkAction } from 'redux-tools';
// import axios from 'axois';
// import sortBy from 'lodash/sortBy';
// import groupBy from 'lodash/groupBy';
// import sumBy from 'lodash/sumBy';
// import max from 'lodash/max';
// import reverse from 'lodash/reverse';
// import tropicalIsos from 'data/tropical-isos.json';
// import { format } from 'd3-format';

// import { getExtent, getLoss } from 'services/forest-data';
import {
  getGeostoreProvider,
  getGeostoreKey,
  getGeoDescriber
} from 'services/geostore';
import { getBoxBounds, getLeafletBbox } from 'utils/geoms';

// const adminSentences = {
//   default:
//     'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
//   withLoss:
//     'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
//   globalInitial:
//     'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
//   withPlantationLoss:
//     'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
//   countrySpecific: {
//     IDN:
//       'In 2010, {location} had {naturalForest} of natural forest, extending over {percentageNatForest} of its land area. In {year}, it lost {loss} of tree cover, equivalent to {emissionsTreeCover} of CO₂ of emissions. {primaryLoss} of this loss occurred within primary forests and {naturalLoss} within natural forest.'
//   },
//   co2Emissions: ', equivalent to {emission} of CO\u2082 of emissions.',
//   end: '.'
// };


export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');
export const clearGeostore = createAction('clearGeostore');
export const setGeoDescriber = createAction('setGeoDescriber');

export const getGeostore = createThunkAction(
  'getGeostore',
  params => (dispatch, getState) => {
    const { type, adm0, adm1, adm2, token } = params;
    const { geostore } = getState();
    if (geostore && !geostore.loading) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      getGeostoreProvider({ type, adm0, adm1, adm2, token })
        .then(response => {
          const { data } = response.data;
          if (data && data.attributes) {
            const { bbox, ...rest } = data.attributes || {};
            dispatch(
              setGeostore({
                id: data.id,
                ...rest,
                bbox: getLeafletBbox(bbox, adm0, adm1),
                bounds: getBoxBounds(bbox, adm0, adm1)
              })
            );
            if (type === 'country') {
              dispatch(setGeostoreLoading({ loading: false, error: false }));
              // getAdminDescription({
              //   ...params,
              //   threshold: 30,
              //   extentYear: 2010
              // }).then(geodescriber => {
              //   dispatch(setGeoDescriber(geodescriber.data.data));
              // });
            } else {
              getGeoDescriber(rest.geojson).then(geodescriber => {
                dispatch(setGeoDescriber(geodescriber.data.data));
              });
            }
          }
        })
        .catch(error => {
          dispatch(setGeostoreLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export const getGeostoreId = createThunkAction(
  'getGeostoreId',
  ({ geojson, callback }) => dispatch => {
    dispatch(setGeostoreLoading({ loading: true, error: false }));
    getGeostoreKey(geojson)
      .then(geostore => {
        if (geostore && geostore.data && geostore.data.data) {
          const { id } = geostore.data.data;
          dispatch(setGeostoreLoading({ loading: false, error: false }));
          if (callback) {
            callback(id);
          }
        }
      })
      .catch(error => {
        setGeostoreLoading({
          loading: false,
          error: true
        });
        console.info(error);
      });
  }
);

// export const getAdminDescription = createThunkAction(
//   'getAdminDescription',
//   params => dispatch => {
//     axios
//       .all([
//         getExtent(params),
//         getExtent({ ...params, forestType: 'plantations' }),
//         getLoss(params),
//         getLoss({ ...params, forestType: 'plantations' }),
//         getLoss({ ...params, forestType: 'primary_forest' })
//       ])
//       .then(
//         axios.spread(
//           (
//             totalExtent,
//             totalPlantationsExtent,
//             totalLoss,
//             totalPlantationsLoss,
//             totalPrimaryLoss
//           ) => {
//             const extent = totalExtent.data.data;
//             const loss = totalLoss.data.data;
//             const plantationsLoss = totalPlantationsLoss.data.data;
//             const plantationsExtent = totalPlantationsExtent.data.data;

//             // group over years
//             const groupedLoss = plantationsLoss && groupBy(loss, 'year');
//             const groupedPlantationsLoss =
//               plantationsLoss && groupBy(plantationsLoss, 'year');

//             const primaryLoss = totalPrimaryLoss.data.data;
//             const latestYear = max(Object.keys(groupedLoss));

//             const latestPlantationLoss =
//               groupedPlantationsLoss[latestYear] || null;
//             const latestLoss = groupedLoss[latestYear] || null;

//             // sum over different bound1 within year
//             const summedPlantationsLoss =
//               latestPlantationLoss &&
//               latestPlantationLoss.length &&
//               latestPlantationLoss[0].area
//                 ? sumBy(latestPlantationLoss, 'area')
//                 : 0;
//             const summedPlantationsEmissions =
//               latestPlantationLoss &&
//               latestPlantationLoss.length &&
//               latestPlantationLoss[0].emissions
//                 ? sumBy(latestPlantationLoss, 'emissions')
//                 : 0;
//             const summedLoss =
//               latestLoss && latestLoss.length && latestLoss[0].area
//                 ? sumBy(latestLoss, 'area')
//                 : 0;
//             const summedEmissions =
//               latestLoss && latestLoss.length && latestLoss[0].emissions
//                 ? sumBy(latestLoss, 'emissions')
//                 : 0;

//             const data = {
//               totalArea: (extent[0] && extent[0].total_area) || 0,
//               extent: (extent[0] && extent[0].extent) || 0,
//               plantationsExtent:
//                 plantationsExtent && plantationsExtent.length
//                   ? plantationsExtent[0].extent
//                   : 0,
//               totalLoss: {
//                 area: summedLoss || 0,
//                 year: latestYear || 0,
//                 emissions: summedEmissions || 0
//               },
//               plantationsLoss: {
//                 area: summedPlantationsLoss || 0,
//                 emissions: summedPlantationsEmissions || 0
//               },
//               primaryLoss:
//                 primaryLoss && primaryLoss.length
//                   ? reverse(sortBy(primaryLoss, 'year'))[0]
//                   : {}
//             };

//             const adminSentenceData = getAdminSentence(data, params);

//             return {
//               description: adminSentenceData.sentence,
//               description_params: adminSentenceData.params,
//               title,
//               title_params,
//               lang: 'en'
//             };
//           }
//         )
//       )
//       .catch(error => {
//         dispatch(setGeostoreLoading({ loading: false, error: true }));
//         console.info(error);
//       });
//   }
// );

// export const getAdminSentence = (data, params) => {
//   const {
//     withLoss,
//     withPlantationLoss,
//     globalInitial,
//     countrySpecific,
//     co2Emissions,
//     end
//   } = adminSentences;

//   const { adm0 } = params;

//   const extent =
//     data.extent < 1 ? format('.3r')(data.extent) : format('.3s')(data.extent);
//   const naturalForest =
//     data.extent - data.plantationsExtent < 1
//       ? format('.3r')(data.extent - data.plantationsExtent)
//       : format('.3s')(data.extent - data.plantationsExtent);
//   const percentageCover = format('.2r')(data.extent / data.totalArea * 100);
//   const percentageNatForest = format('.2r')(
//     (data.extent - data.plantationsExtent) / data.totalArea * 100
//   );
//   const lossWithoutPlantations = format('.3s')(
//     data.totalLoss.area - (data.plantationsLoss.area || 0)
//   );
//   const emissionsWithoutPlantations = format('.3s')(
//     data.totalLoss.emissions - (data.plantationsLoss.emissions || 0)
//   );
//   const emissions = format('.3s')(data.totalLoss.emissions);
//   const primaryLoss = format('.3s')(data.primaryLoss.area || 0);
//   const loss = format('.3s')(data.totalLoss.area || 0);
//   const location = locationNames && locationNames.label;

//   const sentenceParams = {
//     extent: `${extent}ha`,
//     naturalForest: `${naturalForest}ha`,
//     location: location || 'the world',
//     percentage: `${percentageCover}%`,
//     percentageNatForest: `${percentageNatForest}%`,
//     naturalLoss: `${lossWithoutPlantations}ha`,
//     loss: `${loss}ha`,
//     emission: `${emissionsWithoutPlantations}t`,
//     emissionsTreeCover: `${emissions}t`,
//     year: data.totalLoss.year,
//     treeCoverLoss: `${loss}ha`,
//     primaryLoss: `${primaryLoss}ha`
//   };

//   let sentence = adminSentences.default;
//   if (data.extent > 0 && data.totalLoss.area) {
//     sentence =
//       data.plantationsLoss.area && location ? withPlantationLoss : withLoss;
//   }
//   sentence = tropicalIsos.includes(adm0)
//     ? sentence + co2Emissions
//     : sentence + end;
//   if (!location) sentence = globalInitial;
//   if (adm0 in countrySpecific) {
//     sentence = countrySpecific[adm0];
//   }

//   return {
//     sentence,
//     params: sentenceParams
//   };
// };

// export const getAdminsSelected = createSelector(
//   [getAdm0Data, getAdm1Data, getAdm2Data, selectLocation],
//   (adm0s, adm1s, adm2s, location) => {
//     const adm0 = (adm0s && adm0s.find(i => i.value === location.adm0)) || null;
//     const adm1 = (adm1s && adm1s.find(i => i.value === location.adm1)) || null;
//     const adm2 = (adm2s && adm2s.find(i => i.value === location.adm2)) || null;
//     let current = adm0;
//     if (location.adm2) {
//       current = adm2;
//     } else if (location.adm1) {
//       current = adm1;
//     }

//     return {
//       ...current,
//       adm0,
//       adm1,
//       adm2
//     };
//   }
// );

