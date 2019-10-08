const decodes = {
  treeCover: `
    // values for creating power scale, domain (input), and range (output)
    float domainMin = 0.;
    float domainMax = 255.;
    float rangeMin = 0.;
    float rangeMax = 255.;

    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
    float intensity = color.g * 255.;

    // get the min, max, and current values on the power scale
    float minPow = pow(domainMin, exponent - domainMin);
    float maxPow = pow(domainMax, exponent);
    float currentPow = pow(intensity, exponent);

    // get intensity value mapped to range
    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
    // a value between 0 and 255
    alpha = zoom < 13. ? scaleIntensity * 0.8 / 255. : color.g * 0.8;

    color.r = 151. / 255.;
    color.g = 189. / 255.;
    color.b = 61. / 255.;
  `,
  treeCoverLoss: `
    // values for creating power scale, domain (input), and range (output)
    float domainMin = 0.;
    float domainMax = 255.;
    float rangeMin = 0.;
    float rangeMax = 255.;

    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
    float intensity = color.r * 255.;

    // get the min, max, and current values on the power scale
    float minPow = pow(domainMin, exponent - domainMin);
    float maxPow = pow(domainMax, exponent);
    float currentPow = pow(intensity, exponent);

    // get intensity value mapped to range
    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
    // a value between 0 and 255
    alpha = zoom < 13. ? scaleIntensity / 255. : color.g;

    float year = 2000.0 + (color.b * 255.);
    // map to years
    if (year >= startYear && year <= endYear && year >= 2001.) {
      color.r = 220. / 255.;
      color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
      color.b = (33. - zoom + 153. - intensity / zoom) / 255.;
    } else {
      alpha = 0.;
    }
  `,
  treeLossByDriver: `
    float year = 2000.0 + (color.b * 255.);
    // map to years
    if (year >= startYear && year <= endYear && year >= 2001.) {
      // values for creating power scale, domain (input), and range (output)
      float domainMin = 0.;
      float domainMax = 255.;
      float rangeMin = 0.;
      float rangeMax = 255.;

      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
      float intensity = color.r * 255.;

      // get the min, max, and current values on the power scale
      float minPow = pow(domainMin, exponent - domainMin);
      float maxPow = pow(domainMax, exponent);
      float currentPow = pow(intensity, exponent);

      // get intensity value mapped to range
      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;

      // a value between 0 and 255
      alpha = scaleIntensity * 2. / 255.;
      float lossCat = color.g * 255.;

      float r = 255.;
      float g = 255.;
      float b = 255.;

      if (lossCat == 1.) {
        r = 244.;
        g = 29.;
        b = 54.;
      } else if (lossCat == 2.) {
        r = 239.;
        g = 211.;
        b = 26.;
      } else if (lossCat == 3.) {
        r = 47.;
        g = 191.;
        b = 113.;
      } else if (lossCat == 4.) {
        r = 173.;
        g = 104.;
        b = 36.;
      } else if (lossCat == 5.) {
        r = 178.;
        g = 53.;
        b = 204.;
      }

      color.r = r / 255.;
      color.g = g / 255.;
      color.b = b / 255.;
    } else {
      alpha = 0.;
    }
  `,
  GLADs: `
    // values for creating power scale, domain (input), and range (output)
    float confidenceValue = 0.;
    if (confirmedOnly > 0.) {
      confidenceValue = 200.;
    }
    float day = color.r * 255. * 255. + (color.g * 255.);
    float confidence = color.b * 255.;

    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex &&
      confidence >= confidenceValue
    ) {
      // get intensity
      float intensity = mod(confidence, 100.) * 50.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (day >= numberOfDays - 7. && day <= numberOfDays) {
        color.r = 219. / 255.;
        color.g = 168. / 255.;
        color.b = 0.;
        alpha = intensity / 255.;
      } else {
        color.r = 220. / 255.;
        color.g = 102. / 255.;
        color.b = 153. / 255.;
        alpha = intensity / 255.;
      }
    } else {
      alpha = 0.;
    }
  `,
  biomassLoss: `
    float countBuckets = 5.; // buckets length / 3: three bands
    float year = 2000.0 + (color.r * 255.);

    if (year >= 2001. && year >= startYear && year <= endYear) {
      // values for creating power scale, domain (input), and range (output)
      float domainMin = 0.;
      float domainMax = 255.;
      float rangeMin = 0.;
      float rangeMax = 255.;

      float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
      float intensity = color.g * 255.;

      // get the min, max, and current values on the power scale
      float minPow = pow(domainMin, exponent - domainMin);
      float maxPow = pow(domainMax, exponent);
      float currentPow = pow(intensity, exponent);

      // get intensity value mapped to range
      float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;

      float bucket = floor(countBuckets * scaleIntensity / 256.) * 3.;
      float r = 255.;
      float g = 31.;
      float b = 38.;

      if (bucket == 3. || bucket == 6.) {
        r = 210.;
        g = 31.;
        b = 38.;
      } else if (bucket == 9.) {
        r = 241.;
        g = 152.;
        b = 19.;
      } else if (bucket == 12.) {
        r = 255.;
        g = 208.;
        b = 11.;
      }
      color.r = r / 255.;
      color.g = g / 255.;
      color.b = b / 255.;
      alpha = scaleIntensity / 255.;
    } else {
      alpha = 0.;
    }
  `,
  woodyBiomass: `
    float intensity = color.b * 255.;
    color.r = (255. - intensity) / 255.;
    color.g = 128. / 255.;
    color.b = 0.;
    alpha = intensity / 255.;
  `,
  forma: `
    float day = color.g * 255. * 255. + (color.b * 255.);

    if (day >= startDayIndex && day <= endDayIndex) {
      float band3 = color.r * 255.;
      if (band3 > 100.) {
        band3 = band3 - 100.;
      } else if (band3 > 200.) {
        band3 = band3 - 200.;
      }
      float intensity = band3 * 55.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      color.r = 220. / 255.;
      color.g = 102. / 255.;
      color.b = 153. / 255.;
      alpha = intensity / 255.;
    } else {
      alpha = 0.;
    }
  `,
  terrai: `
    float day = color.r * 255. + color.g * 255.;

    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex
    ) {
      float intensity = color.b * 255. * 4.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (day >= numberOfDays - 30. && day <= numberOfDays) {
        color.r = 219. / 255.;
        color.g = 168. / 255.;
        color.b = 0.;
        alpha = intensity / 255.;
      } else {
        color.r = 220. / 255.;
        color.g = 102. / 255.;
        color.b = 153. / 255.;
        alpha = intensity / 255.;
      }
    } else {
      alpha = 0.;
    }
  `,
  braLandCover: `
    float domainMin = 0.;
    float domainMax = 255.;
    float rangeMin = 0.;
    float rangeMax = 255.;

    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
    float intensity = color.g * 255.;

    // get the min, max, and current values on the power scale
    float minPow = pow(domainMin, exponent - domainMin);
    float maxPow = pow(domainMax, exponent);
    float currentPow = pow(intensity, exponent);

    // get intensity value mapped to range
    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;

    alpha = (zoom < 13. ? scaleIntensity : intensity) * 256. / 255.;

    // Forest Formations
    if (color.r == 3. / 255.) {
      color.r = 0. / 255.;
      color.g = 100. / 255.;
      color.b = 0. / 255.;
    } else if (color.r == 4. / 255.) {
      // Savannah Formations
      color.r = 141. / 255.;
      color.g = 144. / 255.;
      color.b = 35. / 255.;
    } else if (color.r == 5. / 255.) {
      // Mangroves
      color.r = 138. / 255.;
      color.g = 168. / 255.;
      color.b = 29. / 255.;
    } else if (color.r == 9. / 255.) {
      // Planted Forest
      color.r = 232. / 255.;
      color.g = 163. / 255.;
      color.b = 229. / 255.;
    } else if (color.r == 11. / 255.) {
      // Non-forest Wetlands
      color.r = 39. / 255.;
      color.g = 137. / 255.;
      color.b = 212. / 255.;
    } else if (color.r == 12. / 255.) {
      // Grassland
      color.r = 204. / 255.;
      color.g = 219. / 255.;
      color.b = 152. / 255.;
    } else if (color.r == 13. / 255.) {
      // Other Non-forest Vegetation
      color.r = 138. / 255.;
      color.g = 184. / 255.;
      color.b = 75. / 255.;
    } else if (color.r == 15. / 255.) {
      // Pasture
      color.r = 255. / 255.;
      color.g = 184. / 255.;
      color.b = 126. / 255.;
    } else if (color.r == 18. / 255.) {
      // Agriculture
      color.r = 210. / 255.;
      color.g = 169. / 255.;
      color.b = 101. / 255.;
    } else if (color.r == 21. / 255.) {
      // Pasture or Agriculture
      color.r = 232. / 255.;
      color.g = 176. / 255.;
      color.b = 113. / 255.;
    } else if (color.r == 23. / 255.) {
      // Beaches and Dunes
      color.r = 221. / 255.;
      color.g = 126. / 255.;
      color.b = 107. / 255.;
    } else if (color.r == 24. / 255.) {
      // Urban Infrastructure
      color.r = 233. / 255.;
      color.g = 70. / 255.;
      color.b = 43. / 255.;
    } else if (color.r == 25. / 255.) {
      // Other Non-vegetated Area
      color.r = 255. / 255.;
      color.g = 153. / 255.;
      color.b = 255. / 255.;
    } else if (color.r == 26. / 255.) {
      // Water Bodies
      color.r = 163. / 255.;
      color.g = 220. / 255.;
      color.b = 254. / 255.;
    } else if (color.r == 27. / 255.) {
      // Unobserved
      color.r = 235. / 255.;
      color.g = 236. / 255.;
      color.b = 236. / 255.;
      alpha = 0.;
    } else if (
      color.r == 1. / 255. ||
      color.r == 2. / 255. ||
      color.r == 10. / 255. ||
      color.r == 14. / 255.
    ) {
      // Unknown / No data
      alpha = 0.;
    } else {
      alpha = 0.;
    }
  `,
  grossCarbonEmissions: `
    float rCol = color.r;
    float yearInt = color.g * 255.;
    float year = 2000.0 + yearInt;
    float threshold = color.b * 255.;

    // map to years
    if (year >= startYear && year <= endYear && year >= 2001. && threshold >= thresh) {
      color.r = 1.;
      color.g = 1. - rCol;
      color.b = 0.;
    } else {
      alpha = 0.;
    }
  `
};

export default {
  '78747ea1-34a9-4aa7-b099-bdb8948200f4': decodes.treeCover,
  'c05c32fd-289c-4b20-8d73-dc2458234e04': decodes.treeCover,
  'c3075c5a-5567-4b09-bc0d-96ed1673f8b6': decodes.treeCoverLoss,
  '0d35db15-9c05-4dbb-9879-ceded4f7951d': decodes.treeCoverLoss,
  'fd05bc2c-6ade-408c-862e-7318557dd4fc': decodes.treeLossByDriver,
  'dd5df87f-39c2-4aeb-a462-3ef969b20b66': decodes.GLADs,
  '9a370f5a-6631-44e3-a955-7f3884c27d91': decodes.GLADs,
  'b32a2f15-25e8-4ecc-98e0-68782ab1c0fe': decodes.biomassLoss,
  'f10bded4-94e2-40b6-8602-ae5bdfc07c08': decodes.woodyBiomass,
  '66203fea-2e58-4a55-b222-1dae075cf95d': decodes.forma,
  '790b46ce-715a-4173-8f2c-53980073acb6': decodes.terrai,
  '220080ec-1641-489c-96c4-4885ed618bf3': decodes.braLandCover,
  'ee23d901-a491-4bc7-af7c-293d0ba50950': decodes.grossCarbonEmissions
};
