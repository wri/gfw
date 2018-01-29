import { fetchGLADDates } from 'services/glad';
import moment from 'moment';
import pickBy from 'lodash/pickBy';
import groupBy from 'lodash/groupBy';
import AnimatedCanvas from './abstract/animatedCanvas';

const OPTIONS = {
  dataMaxZoom: 12,
  urlTemplate:
    'http://wri-tiles.s3.amazonaws.com/glad_staging/tiles/{z}/{x}/{y}.png',
  startDate: '2015-01-01'
};

const padNumber = number => {
  const s = `00${number}`;
  return s.substr(s.length - 3);
};

class Glad extends AnimatedCanvas {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = Object.assign({}, this.options, options);
    this.tiles = {};
    this.setupAnimation();
    this.currentDate = [
      !!options.currentDate && !!options.currentDate[0]
        ? moment.utc(options.currentDate[0])
        : moment.utc(this.options.startDate),
      !!options.currentDate && !!options.currentDate[1]
        ? moment.utc(options.currentDate[1])
        : moment.utc()
    ];
    this.maxDate = this.currentDate[1];
  }

  getLayer() {
    return fetchGLADDates()
      .then(result => {
        const data = result && result.data ? result.data : [];
        const dates = {
          counts: null,
          minDate: null,
          maxDate: null
        };

        if (data.length > 0) {
          const groupedDates = groupBy(data, 'year');
          const years = Object.keys(groupedDates);
          const dataByYear = [];
          const startDay = groupedDates[years[1]];
          const startDate = moment
            .utc()
            .year(years[0])
            .dayOfYear(startDay[0].julian_day);
          const endDay = groupedDates[years[years.length - 1]];
          const endDate = moment
            .utc()
            .year(years[years.length - 1])
            .dayOfYear(endDay[endDay.length - 1].julian_day);
          years.forEach(year => {
            dataByYear[year] = pickBy(data, 'julian_day');
          });

          dates.counts = dataByYear;
          dates.minDate = startDate.format('YYYY-MM-DD');
          dates.maxDate = endDate.format('YYYY-MM-DD');
        }
        this.checkMaxDate(dates);
        return this;
      })
      .catch(error => {
        console.error(error);
      });
  }

  getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  checkMaxDate(response) {
    this.maxDataDate = moment.utc(response.maxDate);
    if (this.maxDate.isAfter(this.maxDataDate)) {
      this.maxDate = this.maxDataDate;
      this.currentDate[1] = this.maxDate;
    }
  }

  filterCanvasImgdata(imgdata, w, h) {
    const imageData = imgdata;
    if (this.timelineExtent === undefined) {
      this.timelineExtent = [
        moment.utc(this.currentDate[0]),
        moment.utc(this.currentDate[1])
      ];
    }

    const startYear = this.timelineExtent[0].year();
    const endYear = this.timelineExtent[1].year();
    const startDay =
      this.timelineExtent[0].dayOfYear() + (startYear - 2015) * 365;
    const endDay = this.timelineExtent[1].dayOfYear() + (endYear - 2015) * 365;

    const recentRangeStart = this.maxDataDate.clone().subtract(7, 'days');
    const recentRangeStartYear = recentRangeStart.year();
    const recentRangeEnd = this.maxDataDate.clone();
    const recentRangeEndYear = recentRangeEnd.year();
    const recentRangeStartDay =
      recentRangeStart.dayOfYear() + (recentRangeStartYear - 2015) * 365;
    const recentRangeEndDay =
      recentRangeEnd.dayOfYear() + (recentRangeEndYear - 2015) * 365;

    const confidenceValue = -1;

    const pixelComponents = 4; // RGBA
    let pixelPos = 0;
    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        pixelPos = (j * w + i) * pixelComponents;

        // find the total days of the pixel by
        // multiplying the red band by 255 and adding
        // the green band to that
        const day = imageData[pixelPos] * 255 + imageData[pixelPos + 1];

        if (day >= startDay && day <= endDay) {
          const band3_str = padNumber(imageData[pixelPos + 2].toString());

          // Grab confidence (the first value) from this string
          // confidence is stored as 1/2, subtract one to make it 0/1
          const confidence = parseInt(band3_str[0], 10) - 1;

          if (confidence >= confidenceValue) {
            // Grab the raw intensity value from the pixel; ranges from 1 - 255
            const intensity_raw = parseInt(band3_str.slice(1, 3), 10);
            // Scale the intensity to make it visible
            let intensity = intensity_raw * 50;
            // Set intensity to 255 if it's > than that value
            if (intensity > 255) {
              intensity = 255;
            }

            if (day >= recentRangeStartDay && day <= recentRangeEndDay) {
              imageData[pixelPos] = 219;
              imageData[pixelPos + 1] = 168;
              imageData[pixelPos + 2] = 0;
              imageData[pixelPos + 3] = intensity;
            } else {
              imageData[pixelPos] = 220;
              imageData[pixelPos + 1] = 102;
              imageData[pixelPos + 2] = 153;
              imageData[pixelPos + 3] = intensity;
            }
            continue;
          }
        }

        imageData[pixelPos + 3] = 0;
      }
    }
  }
}

export default Glad;
