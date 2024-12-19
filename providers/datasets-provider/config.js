// https://www.khronos.org/files/opengles_shading_language.pdf

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
  treeCoverGain5y: `
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

  float year = 1999.0 + ((color.b * 5.) * 255.);
  // map to years
  // Old colors: 109, 72, 33
  // New colors: 19, 3, 255
  if (year >= startYear && year <= endYear && year >= 2001.) {
    color.r = 19. / 255.;
    color.g = (72. - zoom + 3. - scaleIntensity / zoom) / 255.;
    color.b = (33. - zoom + 255. - intensity / zoom) / 255.;
    alpha = (8. * intensity) / 255.;
  } else {
    alpha = 0.;
  }
`,
  treeCoverLossFire: `
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
  alpha = zoom < 13. ? (scaleIntensity)/ 255. : color.g;

  float year = 2000.0 + (color.b * 255.);
  // map to years
  if (year >= startYear && year <= endYear && year >= 2001.) {
    // values entered directly, unlike TCL where final color changes with zoom level
    color.r = 154. / 255.;
    color.g = 91. / 255.;
    color.b = 80. / 255.;
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
  integratedAlerts8Bitprevious: `
    // First 6 bits Alpha channel used to individual alert confidence
    // First two bits (leftmost) are GLAD-L
    // Next, 3rd and 4th bits are GLAD-S2
    // Finally, 5th and 6th bits are RADD
    // Bits are either: 00 (0, no alerts), 01 (1, low conf), or 10 (2, high conf)
    // e.g. 00 10 01 00 --> no GLAD-L, high conf GLAD-S2, low conf RADD

    float agreementValue = alpha * 255.;

    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;

    float day = r * 255. + g;
    // float confidence = floor(b / 100.) - 1.;

    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex &&
      agreementValue > 0.
    ) {

      // get intensity
      // float intensity = mod(confidence, 100.) * 50.;
      float intensity = 255.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      // get high and highest confidence alerts
      float confidenceValue = 0.;
      if (confirmedOnly > 0.) {
        confidenceValue = 255.;
      }

      // glad l alerts only
      if (gladLOnly > 0.) {
        if (agreementValue == 64.) {
          color.r = 237. / 255.;
          color.g = 164. / 255.;
          color.b = 194. / 255.;
          alpha = (intensity - confidenceValue) / 255.;
        } else if (agreementValue == 128.){
          // glad only and high confidence
          color.r = 220. / 255.;
          color.g = 102. / 255.;
          color.b = 153. / 255.;
          alpha = intensity / 255.;
        } else {
          alpha = 0.;
        }
        // glad s alerts only
      } else if (gladSOnly > 0.) {
        if (agreementValue == 16.) {
            color.r = 237. / 255.;
            color.g = 164. / 255.;
            color.b = 194. / 255.;
            alpha = (intensity - confidenceValue) / 255.;
        } else if (agreementValue == 32.) {
          color.r = 220. / 255.;
          color.g = 102. / 255.;
          color.b = 153. / 255.;
          alpha = intensity / 255.;
        } else {
          alpha = 0.;
        }
        // radd alerts only
      } else if (raddOnly > 0.) {
        if (agreementValue == 4.) {
          color.r = 237. / 255.;
          color.g = 164. / 255.;
          color.b = 194. / 255.;
          alpha = (intensity - confidenceValue) / 255.;
        } else if (agreementValue == 8.) {
          color.r = 220. / 255.;
          color.g = 102. / 255.;
          color.b = 153. / 255.;
          alpha = intensity / 255.;
        } else {
          alpha = 0.;
        }
      }  else if (agreementValue == 4. || agreementValue == 16. || agreementValue == 64.) {
        // ONE ALERT LOW CONF: 4,8,16,32,64,128 i.e. 2**(2+n) for n<8

        color.r = 237. / 255.;
        color.g = 164. / 255.;
        color.b = 194. / 255.;
        alpha = (intensity - confidenceValue) / 255.;
      } else if (agreementValue == 8. || agreementValue == 32. || agreementValue ==  128.){
        // ONE HIGH CONF ALERT: 8,32,128 i.e. 2**(2+n) for n<8 and odd

        color.r = 220. / 255.;
        color.g = 102. / 255.;
        color.b = 153. / 255.;
        alpha = intensity / 255.;
      } else {
        // MULTIPLE ALERTS: >0 and not 2**(2+n)

        color.r = 201. / 255.;
        color.g = 42. / 255.;
        color.b = 109. / 255.;
        alpha = intensity / 255.;

      }
    } else {
      alpha = 0.;
    }
  `,
  integratedAlerts8Bit: `
  // First 6 bits Alpha channel used to individual alert confidence
    // First two bits (leftmost) are GLAD-L
    // Next, 3rd and 4th bits are GLAD-S2
    // Finally, 5th and 6th bits are RADD
    // Bits are either: 00 (0, no alerts), 01 (1, low conf), or 10 (2, high conf)
    // e.g. 00 10 01 00 --> no GLAD-L, high conf GLAD-S2, low conf RADD

    float agreementValue = alpha * 255.;

    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;

    float day = r * 255. + g;
    float confidence = floor(b / 100.) - 1.;
    // float confidence = 255.;
    float intensity = mod(b, 100.) * 150.;
    // float intensity = 255.; //this is temporal above one does not work

    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex &&
      agreementValue > 0.
    )
    {
      if (intensity > 255.) {
        intensity = 255.;
      }
      // get high and highest confidence alerts
      float confidenceValue = 0.;
      if (confirmedOnly > 0.) {
        confidenceValue = 255.;
      }

      if (agreementValue == 4. || agreementValue == 16. || agreementValue == 64.) {
        // ONE ALERT LOW CONF: 4,8,16,32,64,128 i.e. 2**(2+n) for n<8

        color.r = 237. / 255.;
        color.g = 164. / 255.;
        color.b = 194. / 255.;
        alpha = (intensity -confidenceValue) / 255.;
      } else if (agreementValue == 8. || agreementValue == 32. || agreementValue ==  128.){
        // ONE HIGH CONF ALERT: 8,32,128 i.e. 2**(2+n) for n<8 and odd

        color.r = 220. / 255.;
        color.g = 102. / 255.;
        color.b = 153. / 255.;
        alpha = intensity / 255.;
      } else {
        // MULTIPLE ALERTS: >0 and not 2**(2+n)

        color.r = 201. / 255.;
        color.g = 42. / 255.;
        color.b = 109. / 255.;
        alpha = intensity / 255.;
      }
    } else {
      alpha = 0.;
    }
  `,
  integratedAlerts16Bit: `
    // The Red, Green, and Blue bands are GLAD, GLAD-S2 and RADD, respectively.
    // They are 16-bit unsigned, abbbb where a is the confirmation status (2 for unconfirmed, 3 for confirmed)
    // bbbb is the number of days past Dec. 31, 2014 (with 1 being January 1st, 2015).
    // Then there's the Alpha band, which encodes an intensity for each of the bands.
    // From most-significant bit to least-significant bit, 5 bits encode the intensity (from 0-31, so lower max than the 8-bit band) for GLAD, GLAD-S2, and RADD in that order. Thus the last (least-significant) bit is unused.

    int highConfCount = 0;
    int alertCount = 0;
    float upperLimit = 30000.;
    float lowerLimit = 20000.;

    // GLAD L
    float gladL = color.r * 255.;
    if (gladL > 0.){
      float highConfDaysGL = gladL - upperLimit;
      float lowConfDaysGL = gladL - lowerLimit;
      int dayGladLHighConf = 0;
      float dayGladL = 0.;
      if (sign(highConfDaysGL) == 1.){
        dayGladL = gladL - upperLimit;
        dayGladLHighConf = 1;
      }
      else if (sign(lowConfDaysGL) == 1.) {
        dayGladL = gladL - lowerLimit;
      }
      if (
        dayGladL > 0. &&
        dayGladL >= startDayIndex &&
        dayGladL <= endDayIndex
      ) {
        alertCount += 1;
        highConfCount += dayGladLHighConf;
      }
    }

    // GLAD S2
    float gladS2 = color.g * 255.;
    if (gladS2 > 0.){
      float highConfDaysGS2 = gladS2 - upperLimit;
      float lowConfDaysGS2 = gladS2 - lowerLimit;
      int dayGladS2HighConf = 0;
      float dayGladS2 = 0.;
      if (sign(highConfDaysGS2) == 1.){
        dayGladS2 = gladS2 - upperLimit;
        dayGladS2HighConf = 1;
      }
      else if (sign(lowConfDaysGS2) == 1.){
        dayGladS2 = gladS2 - lowerLimit;
      }
      if (
        dayGladS2 > 0. &&
        dayGladS2 >= startDayIndex &&
        dayGladS2 <= endDayIndex
      ) {
        alertCount += 1;
        highConfCount += dayGladS2HighConf;
      }
    }

    // RADD
    float radd = color.b * 255.;
    if (radd > 0.){
      float highConfDaysR = radd - upperLimit;
      float lowConfDaysR = radd - lowerLimit;
      int dayRaddHighConf = 0;
      float dayRadd = 0.;
      if (sign(highConfDaysR) == 1.){
        dayRadd = radd - upperLimit;
        dayRaddHighConf = 1;
      }
      else if (sign(lowConfDaysR) == 1.) {
        dayRadd = radd - lowerLimit;
      }
      if (
        dayRadd > 0. &&
        dayRadd >= startDayIndex &&
        dayRadd <= endDayIndex
      ) {
        alertCount += 1;
        highConfCount += dayRaddHighConf;
      }
    }

    alpha = 0.;
    if (alertCount == 1) {
      // ONE ALERT

      color.r = 237. / 255.;
      color.g = 164. / 255.;
      color.b = 194. / 255.;
      alpha = 1.;
    } else if (alertCount == 1 && highConfCount == 1){
      // ONE HIGH CONF ALERT:

      color.r = 220. / 255.;
      color.g = 102. / 255.;
      color.b = 153. / 255.;
      alpha = 1.;
    } else if (alertCount > 1) {
      // MULTIPLE ALERTS

      color.r = 201. / 255.;
      color.g = 42. / 255.;
      color.b = 109. / 255.;
      alpha = 1.;
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
      float intensity = mod(confidence, 100.) * 150.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (confidence < 200.) {
        color.r = 237. / 255.;
        color.g = 164. / 255.;
        color.b = 194. / 255.;
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
  RADDs: `
  // todo: this decode function would be deprecated when replacing indicidual radd and glads alerts by integrated alerts
  // values for creating power scale, domain (input), and range (output)
    float confidenceValue = 0.;
    if (confirmedOnly > 0.) {
      confidenceValue = 1.;
    }

    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;

    // **** CHECK THIS
    // 1461 = days from 2019/01/01 to 2014/12/31
    // 1870 = days from 2020/02/14 to 2014/12/31
    float day = (r * 255.) + g - 1870. ;

    float confidence = floor(b / 100.) - 1.;
    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex  &&
      confidence >= confidenceValue
    ) {
      // get intensity
      float intensity = mod(b, 100.) * 50.;
      // float intensity = 255.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (confidence < 1.) {
        color.r = 237. / 255.;
        color.g = 164. / 255.;
        color.b = 194. / 255.;
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
  RADDs2yearsTimeline: `
  // values for creating power scale, domain (input), and range (output)
    float confidenceValue = 0.;
    if (confirmedOnly > 0.) {
      confidenceValue = 1.;
    }

    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;

    // **** CHECK THIS
    // 1461 = days from 2019/01/01 to 2014/12/31
    // 1870 = days from 2020/02/14 to 2014/12/31
    float day = (r * 255.) + g;

    float confidence = floor(b / 100.) - 1.;
    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex  &&
      confidence >= confidenceValue
    ) {
      // get intensity
      float intensity = mod(b, 100.) * 150.;
      // float intensity = 255.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (confidence < 1.) {
        color.r = 237. / 255.;
        color.g = 164. / 255.;
        color.b = 194. / 255.;
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
  distAlerts: `
  // values for creating power scale, domain (input), and range (output)
    float confidenceValue = 0.;
    if (confirmedOnly > 0.) {
      confidenceValue = 1.;
    }

    float r = color.r * 255.;
    float g = color.g * 255.;
    float b = color.b * 255.;

    // **** CHECK THIS
    // 1461 = days from 2019/01/01 to 2014/12/31
    // 1870 = days from 2020/02/14 to 2014/12/31
    float day = (r * 255.) + g;

    float confidence = floor(b / 100.);
    if (
      day > 0. &&
      day >= startDayIndex &&
      day <= endDayIndex  &&
      confidence >= confidenceValue &&
      alpha > 0.
    ) {
      // get intensity
      float intensity = mod(b, 100.) * 50.;
      // float intensity = 255.;
      if (intensity > 255.) {
        intensity = 255.;
      }
      if (confidence < 2.) {
        color.r = 238. / 255.;
        color.g = 177. / 255.;
        color.b = 177. / 255.;
        alpha = intensity / 255.;
      } else {
        color.r = 137. / 255.;
        color.g = 82. / 255.;
        color.b = 119. / 255.;
        alpha = intensity / 255.;
      }
    } else {
      alpha = 0.;
    }
  `,
  RADDsCoverage: `
    float red = color.r;
    float green = color.g;
    float blue = color.b;

    if (red == 0. && green == 0. && blue == 0.) {
      alpha = 0.;
    } else {
      color.r = 253. / 255.;
      color.g = 204. / 255.;
      color.b = 220. / 255.;
      alpha = 1.;
    }
  `,
  staticRemap: `
    float red = color.r;
    float green = color.g;
    float blue = color.b;

    if (red == 0. && green == 0. && blue == 0.) {
      alpha = 0.;
    } else {
      alpha = 1.;
    }

    color.r = red;
    color.g = green;
    color.b = blue;
  `,
  staticRemapAlpha: `
    float red = color.r;
    float green = color.g;
    float blue = color.b;

    if (zoom > 12.) {
      if (red == 0. && green == 0. && blue == 0.) {
        alpha = 0.;
      } else {
        alpha = 1.;
      }
    }
    color.r = red;
    color.g = green;
    color.b = blue; 
  `,
  treeGain: `
    // Multiply alpha (opacity) by a function that drops super low opacity
    // pixels and scales the rest to higher values
    // TODO: Explain the various coefficients and how they effect alpha
    
    if (zoom < 12.) {
      if (color.r == 0. && color.g == 0. && color.b == 0.) {
        alpha = 0.;
      } else {
        alpha = 1.- (1.1 * pow(8. , -(12. * alpha / zoom)));
      }
    }
`,
  newCarbonFlux: `
    float red = color.r;
    float green = color.g;
    float blue = color.b;

    if (red == 0. && green == 0. && blue == 0.) {
      alpha = 0.;
    } else {
      alpha = 1.;
    }

    color.r = red;
    color.g = green;
    color.b = blue;
  `,
  forestHeight: `
    float h = color.r * 255.;
    float heightMax = 41.;

    // color at 3m
    float r1 = 230. / 255.;
    float g1 = 240. / 255.;
    float b1 = 230. / 255.;

    // color at 30m
    float r2 = 0. / 255.;
    float g2 = 102. / 255.;
    float b2 = 0. / 255.;

    vec3 colorMin = vec3(r1, g1, b1);
    vec3 colorMax = vec3(r2, g2, b2);

    // h > 30m will default to colorMax
    color = mix(colorMin, colorMax, h / 30.);

    // Only show pixels bettween the specified height and heightMax from data
    if (h >= height && h <= heightMax) {
      alpha = 1.;
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
  `,
};

export default {
  treeCover: decodes.treeCover,
  treeCoverLoss: decodes.treeCoverLoss,
  treeCoverGain5y: decodes.treeCoverGain5y,
  treeCoverLossFire: decodes.treeCoverLossFire,
  treeLossByDriver: decodes.treeLossByDriver,
  integratedAlerts8Bit: decodes.integratedAlerts8Bit,
  integratedAlerts16Bit: decodes.integratedAlerts16Bit,
  GLADs: decodes.GLADs,
  RADDs: decodes.RADDs,
  RADDs2yearsTimeline: decodes.RADDs2yearsTimeline,
  distAlerts: decodes.distAlerts,
  RADDsCoverage: decodes.RADDsCoverage,
  staticRemap: decodes.staticRemap,
  staticRemapAlpha: decodes.staticRemapAlpha,
  forestHeight: decodes.forestHeight,
  biomassLoss: decodes.biomassLoss,
  woodyBiomass: decodes.woodyBiomass,
  terrai: decodes.terrai,
  braLandCover: decodes.braLandCover,
  grossCarbonEmissions: decodes.grossCarbonEmissions,
  cumulativeCarbonGain: decodes.cumulativeCarbonGain,
  netGHGFlux: decodes.netCarbonFlux,
  formaAlerts: decodes.forma,
  treeGain: decodes.treeGain,
};
