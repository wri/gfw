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
    float bCol = color.b;
    float threshold = bCol * 255.;

    float rVal = rCol * 3885.;

    float r5 = 250. / 255.;
    float g5 = 247. / 255.;
    float b5 = 202. / 255.;
    float col5 = 0.;
    vec3 color5 = vec3(r5, g5, b5);

    float r6 = 245. / 255.;
    float g6 = 193. / 255.;
    float b6 = 95. / 255.;
    float col6 = 3.5;
    vec3 color6 = vec3(r6, g6, b6);

    float r7 = 227. / 255.;
    float g7 = 134. / 255.;
    float b7 = 64. / 255.;
    float col7 = 13.9;
    vec3 color7 = vec3(r7, g7, b7);

    float r8 = 199. / 255.;
    float g8 = 78. / 255.;
    float b8 = 34. / 255.;
    float col8 = 139.;
    vec3 color8 = vec3(r8, g8, b8);

    float r9 = 166. / 255.;
    float g9 = 0. / 255.;
    float b9 = 0. / 255.;
    float col9 = 3885.;
    vec3 color9 = vec3(r9, g9, b9);

    // map to years
    if (threshold >= thresh) {
      if (rVal <= col6) {
        color = mix(color5, color6, rCol);
      } else if (rVal <= col7) {
        color = mix(color6, color7, rCol);
      } else if (rVal <= col8) {
        color = mix(color7, color8, rCol);
      } else {
        color = mix(color8, color9, rCol);
      }
    } else {
      alpha = 0.;
    }
  `,
  cumulativeCarbonGain: `
    float rCol = color.r;
    float gCol = color.g;
    float threshold = gCol * 255.;

    float rVal = rCol * 1116.;

    float r1 = 0. / 255.;
    float g1 = 105. / 255.;
    float b1 = 42. / 255.;
    float col1 = 1116.;
    vec3 color1 = vec3(r1, g1, b1);

    float r2 = 68. / 255.;
    float g2 = 140. / 255.;
    float b2 = 53. / 255.;
    float col2 = 250.;
    vec3 color2 = vec3(r2, g2, b2);

    float r3 = 125. / 255.;
    float g3 = 179. / 255.;
    float b3 = 68. / 255.;
    float col3 = 124.;
    vec3 color3 = vec3(r3, g3, b3);

    float r4 = 190. / 255.;
    float g4 = 214. / 255.;
    float b4 = 92. / 255.;
    float col4 = 25.;
    vec3 color4 = vec3(r4, g4, b4);

    float r5 = 250. / 255.;
    float g5 = 247. / 255.;
    float b5 = 202. / 255.;
    float col5 = 0.;
    vec3 color5 = vec3(r5, g5, b5);

    // map to years
    if (threshold >= thresh) {
      if (rVal >= col2) {
        color = mix(color1, color2, rCol);
      } else if (rVal >= col3) {
        color = mix(color2, color3, rCol);
      } else if (rVal >= col4) {
        color = mix(color3, color4, rCol);
      } else {
        color = mix(color4, color5, rCol);
      }
    } else {
      alpha = 0.;
    }
  `,
  netCarbonFlux: `
    float rCol = color.r;
    float gCol = color.g;
    float threshold = gCol * 255.;

    float rVal = rCol * 5001.;

    float r1 = 0. / 255.;
    float g1 = 105. / 255.;
    float b1 = 42. / 255.;
    float col1 = 0.;
    vec3 color1 = vec3(r1, g1, b1);

    float r2 = 68. / 255.;
    float g2 = 140. / 255.;
    float b2 = 53. / 255.;
    float col2 = 886.;
    vec3 color2 = vec3(r2, g2, b2);

    float r3 = 125. / 255.;
    float g3 = 179. / 255.;
    float b3 = 68. / 255.;
    float col3 = 992.;
    vec3 color3 = vec3(r3, g3, b3);

    float r4 = 190. / 255.;
    float g4 = 214. / 255.;
    float b4 = 92. / 255.;
    float col4 = 1091.;
    vec3 color4 = vec3(r4, g4, b4);

    float r5 = 250. / 255.;
    float g5 = 247. / 255.;
    float b5 = 202. / 255.;
    float col5 = 1116.;
    vec3 color5 = vec3(r5, g5, b5);

    float r6 = 245. / 255.;
    float g6 = 193. / 255.;
    float b6 = 95. / 255.;
    float col6 = 1119.5;
    vec3 color6 = vec3(r6, g6, b6);

    float r7 = 227. / 255.;
    float g7 = 134. / 255.;
    float b7 = 64. / 255.;
    float col7 = 1129.9;
    vec3 color7 = vec3(r7, g7, b7);

    float r8 = 199. / 255.;
    float g8 = 78. / 255.;
    float b8 = 34. / 255.;
    float col8 = 1255.;
    vec3 color8 = vec3(r8, g8, b8);

    float r9 = 166. / 255.;
    float g9 = 0. / 255.;
    float b9 = 0. / 255.;
    float col9 = 3885.;
    vec3 color9 = vec3(r9, g9, b9);

    // map to years
    if (threshold >= thresh) {
      if (rVal <= col2) {
        color = mix(color1, color2, rCol);
      } else if (rVal <= col3) {
        color = mix(color2, color3, rCol);
      } else if (rVal <= col4) {
        color = mix(color3, color4, rCol);
      } else if (rVal <= col5) {
        color = mix(color4, color5, rCol);
      } else if (rVal <= col6) {
        color = mix(color5, color6, rCol);
      } else if (rVal <= col7) {
        color = mix(color6, color7, rCol);
      } else if (rVal <= col8) {
        color = mix(color7, color8, rCol);
      } else {
        color = mix(color8, color9, rCol);
      }
    } else {
      alpha = 0.;
    }
  `
};

export default {
  treeCover: decodes.treeCover,
  treeCoverLoss: decodes.treeCoverLoss,
  treeLossByDriver: decodes.treeLossByDriver,
  GLADs: decodes.GLADs,
  '9a370f5a-6631-44e3-a955-7f3884c27d91': decodes.GLADs, // TODO: remove?
  biomassLoss: decodes.biomassLoss,
  woodyBiomass: decodes.woodyBiomass,
  '66203fea-2e58-4a55-b222-1dae075cf95d': decodes.forma,
  terrai: decodes.terrai,
  braLandCover: decodes.braLandCover,
  '7b6acc5f-bc18-4e13-951c-0d81639d68a7': decodes.grossCarbonEmissions,
  '5614e8ef-3e10-43d8-9e0c-7a9ddde93b81': decodes.cumulativeCarbonGain,
  'b2070db1-f01c-4107-8c2a-50fe77d3fbce': decodes.netCarbonFlux
};
