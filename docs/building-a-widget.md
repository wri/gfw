# Building a Widget from scratch (kinda)

Created: September 3, 2020 11:06 AM
Last Edited Time: July 24, 2022 10:57 PM
Status: Completed
Tag: Front end, Widget
Type: Process

## Overview

If you're reading this, it's already too late. I'm gone. Good news is that this document outlines the process to add a new widget (*almost from scratch!*). It will cover everything from getting a simple visualisation showing on certain Dashboards, how to make fetches, parse data for the chart, create dynamic sentences...

It will not cover how to create charts from scratch (sorry!)

In the following example we will create a simple Pie Chart widget that pulls data from the GFW Data API (specifically, from [https://staging-data-api.globalforestwatch.org/dataset/gadm__integrated_alerts__iso_daily_alerts](https://staging-data-api.globalforestwatch.org/dataset/gadm__integrated_alerts__iso_daily_alerts))

PR here [https://github.com/Vizzuality/gfw/pull/4296](https://github.com/Vizzuality/gfw/pull/4296)

## 1. Creating a template widget

The first step is to create a template widget. The simplest way to do this is to copy an existing widget. 

![C*opy the entire widget folder. Here we will copy `components>widgets>forest-change>glad-alerts-simple`*](Building%20a%20Widget%20from%20scratch%20(kinda)%20ef9d358ee45a4408b70341e1124fdc8c/Screen_Shot_2021-08-17_at_17.54.01.png)

C*opy the entire widget folder. Here we will copy `components>widgets>forest-change>glad-alerts-simple`*

- Make a copy of an existing Pie Chart widget folder (here, `glad-alerts-simple`)
- In the config found in `glad-alerts-simple/index.js` rename the widget slug, as well as the widget title (so you can tell the difference!):

```jsx
import getWidgetProps from './selectors';

export default {
  widget: 'integratedDeforestationAlerts',
  title: 'TEST Integrated Deforestation alerts in {location}',
  sentence: {
    default: ...
```

This is necessary as each widget slug must be unique for each widget (if non-unique, only one will show)

- Add the new widget slug to `components/widgets/manifest.js` which will import the widget slug config from the `index.js` config

```jsx
// forest change

import gladAlertsSimple from 'components/widgets/forest-change/glad-alerts-simple';
import integratedDeforestationAlerts from 'components/widgets/forest-change/integrated-deforestation-alerts';

export default {
  // forest change
  gladAlertsSimple,
	integratedDeforestationAlerts,
}
```

Run locally using `yarn dev` to check your widget exists in the right place. In this case here: [http://localhost:3000/dashboards/country/BRA/1/?category=forest-change](http://localhost:3000/dashboards/country/BRA/1/?category=forest-change)

![Screen Shot 2021-08-17 at 18.13.02.png](Building%20a%20Widget%20from%20scratch%20(kinda)%20ef9d358ee45a4408b70341e1124fdc8c/Screen_Shot_2021-08-17_at_18.13.02.png)

It's often easier to develop using the embed link, as it reduced the number of fetches being made by the page e.g. [http://localhost:3000/embed/widget/integratedDeforestationAlerts/country/BRA/1](http://localhost:3000/embed/widget/integratedDeforestationAlerts/country/BRA/1)

## 2. Implement Fetches

Currently the widget makes all the same fetches as the one it is copied from. To update this we should add the new data source table (if there is one), create a new set of SQL fetches if necessary, and tweak any initial data parsers. These are spread across multiple places in the FE.

### 2a. Add table to `analysis-datasets.json`

Next we need to add the table (`gadm__integrated_alerts__iso_daily_alerts`) to the static json that tracks all data source tables for widgets.

```jsx
"INTEGRATED_ALERTS_ADM0_DAILY": "gadm__integrated_alerts__iso_daily_alerts",
```

Here the **key** represents the *dataset slug* that the application will track internally, and is always in the form: `<Dataset>_<Reporting unit>_<Resolution>` where Resolution can be: `DAILY`, `WEEKLY`, `ANNUAL`, `SUMMARY` (i.e. static), or `WHITELIST` (which is a special case - this dataset just tracks whether data exists for that reporting unit.

The slug is structured such that the application can interpret which dataset to go to based on information present in the widget's config found in `index.js` (more on this later).

The **value** for that key is simply the Data API dataset slug (which we will use to construct an API fetch).

### 2b. Update `getData` in `index.js`

Now we need to update the code that will eventually use the above dataset slug to begin parsing the necessary fetch. The entrypoint for which is in the `getData()` function on `index.js`

```jsx
// import function(s) for retrieving glad alerts from tables
import {
  fetchIntegratedAlerts,
} from 'services/analysis-cached';

getData: (params) => {
		// Gets pre-fetched GLAD-related metadata from the state...
    const { GLAD } = params.GFW_META.datasets; 
    
		// extract relevant metadata
		const defaultStartDate = GLAD?.defaultStartDate;
    const defaultEndDate = GLAD?.defaultEndDate;
    const startDate = params?.startDate || defaultStartDate;
    const endDate = params?.endDate || defaultEndDate;

		// Decide if we are in Dashboards, AoI or Map page i.e. do we do OTF or not? 
    if (shouldQueryPrecomputedTables(params)) {  

			// function reference to parse fetch
      return fetchIntegratedAlerts({
				// widget settings passed to the fetch function from the config above as well as the state 
        ...params, 
        startDate,
        endDate
			// once fetch resolves... then do the following. Usually, some basic parsing
      }).then((alerts) => { 
        const gladsData = alerts && alerts.data.data;
```

The `getData()` function is triggered when the widget loads. In the above we have defined only the fetch that will happen in two simple cases:

1. On **country** dashboards (i.e. `dashboards/BRA/1` etc)
2. For on-click map analysis (clicking a country shape in the map)

However, we will later need to also define fetches for:

1. On the Fly (OTF) analysis (i.e. custom shape on the map)
2. AoI & WDPA dashboards (which require different tables to be added to `analysis-datasets.json`
3. Downloads

(*these are not covered here*) 

We have added a new function `fetchIntegratedAlerts` which we need to now create since it is not yet defined in `analysis-cached.js`

### 2c. Create fetch function in `analysis-cached.js`

Once the widget loads it will try to fetch data by sending an SQL query to the Data API based on the widget config, selected user settings, and dashboard type. All of this is handled in `analysis-cached.js`

Firstly, let's define the `fetchIntegratedAlerts` function using `export const fetchGladAlertsSum` as a reference point.

```jsx
export const fetchIntegratedAlerts = (params) => {
  // Params 
  const { startDate, endDate, download } =
    params || {};
  // Construct base url for fetch
  const baseUrl = `${getRequestUrl({
    ...params,
    dataset: 'integrated',
    datasetType: 'daily',
    // version override necessary here (no 'latest' defined)
    version: 'v20210813'
  // Refernces the base SQL from the SQL_QUERIES object
  })}${SQL_QUERIES.integratedAlertsDaily}`;

  if (download) {
    // No download yet
  }

  // Replace base url params and encode
  const url = encodeURI(
    baseUrl
      .replace(
        /{select_location}/g,
        getLocationSelect({ ...params, cast: true }) // cast=true ensures that values are cast in POSTgres to teh expected type
      )
      .replace(/{location}/g, getLocationSelect(params))
      .replace('{startDate}', startDate)
      .replace('{endDate}', endDate)
      .replace('{WHERE}', getWHEREQuery({ ...params, dataset: 'glad' }))
  );

  // Light initial Parsing that gets returned to index.js
  return apiRequest.get(url).then((response) => ({
    data: {
      data: response.data.data.map((d) => ({
        ...d,
        date: d.gfw_integrated_alerts__date,
        confidence: d.gfw_integrated_alerts__confidence,
        count: d.alert__count,
      })),
    },
  }));
};
```

We also need add an SQL template (`integratedAlertsDaily`) to `SQL_QUERIES`

```jsx
integratedAlertsDaily: `SELECT {select_location}, SUM(alert__count) AS alert__count, gfw_integrated_alerts__confidence FROM data {WHERE} AND gfw_integrated_alerts__date >= '{startDate}' AND gfw_integrated_alerts__date <= '{endDate}' GROUP BY {location}, gfw_integrated_alerts__confidence`,
```

...and test by inspecting network activity in the console! 

<aside>
💡 It's often useful to use [https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/) to decode the resulting SQL queries being made. You may have `undefined`'s being inserted or incorrect query parsing that results in no data being returned.

In this particular case i needed to hardcode: `startDate='2021-01-01'` and `endDate: '2021-01-10'` in `index.js` params to return any data.

</aside>

For the Brazil dashboard the following query: 

```sql
https://staging-data-api.globalforestwatch.org/dataset/gadm__integrated_alerts__iso_daily_alerts/v20210813/query/json?sql=
SELECT iso, SUM(alert__count) AS alert__count, gfw_integrated_alerts__confidence
FROM data
WHERE iso = 'BRA'
	AND gfw_integrated_alerts__date >= '2021-08-08'
	AND gfw_integrated_alerts__date <= '2021-08-15'
GROUP BY iso, gfw_integrated_alerts__confidence
```

returns:

```json
{
"data": [
	{
		"iso": "BRA",
		"alert__count": 2157313,
		"gfw_integrated_alerts__confidence": "high"
	},{
		"iso": "BRA",
		"alert__count": 407818,
		"gfw_integrated_alerts__confidence": "highest"
	},{
		"iso": "BRA",
		"alert__count": 159370,
		"gfw_integrated_alerts__confidence": "nominal"
	}
],
"status": "success"
}
```

which then gets interpreted in the `return` object of `fetchIntegratedAlerts`. We have data!

## 3. Update `index.js`

Next we (may) need to do some further parsing in `index.js` before the data gets passed to the `selectors.js` where the chart, title and dynamic sentence logic is held.

### 3a. Final pre-parsing in `index.js`

If necessary, we can apply some final parsing (i.e. set default values) inside `getData`

```jsx
}).then((alerts) => {
        const integratedAlertsData = alerts && alerts.data.data;
        let data = {};
        if (integratedAlertsData && GLAD) {
          data = {
            alerts: integratedAlertsData,
            settings: {
              startDate,
              endDate,
            },
            options: {
              minDate: '2015-01-01',
              maxDate: defaultEndDate,
            },
          };
        }
        return data;
      });
    }
```

the values in `return data;` are then passed into the selectors.

### 3b. Update dynamic sentence(s) in `index.js`

Template sentences are found in the widget config:

```jsx
export default {
  widget: 'integratedDeforestationAlerts',
  title: 'TEST Integrated Deforestation alerts in {location}',
  sentence: {
    default:
      'There were {total} alerts reported in {location} between {startDate} and {endDate} of which {highConfPerc} were high confidence alerts detected by a single system and {highestConfPerc} were alerts detected by multiple systems.',
    withInd:
      'There were {total} alerts reported within {indicator} in {location} between {startDate} and {endDate} of which {highConfPerc} were high confidence alerts detected by a single system and {highestConfPerc} were alerts detected by multiple systems.'
  },
```

Usually, there is a `default` sentence, with others which depend on settings or params (such as whether an indicator has been selected; eg `forestType='primary_forest'` or `landCategory='mining'`)

Parameters that will be inserted into the template are wrapped in `{}` . The parameters will appear in **bold** in the sentence and are defined in the selectors in `selectors.js`

## 4. Update `selectors.js`

Selectors deal with all the final parsing of data due that gets passed to Chart and Sentence components that are surfaced for the user to see as a widget.

### 4a. Initial Selector Data Parsing

Initially we parse a simple data structure that can be passed to all other selector functions (chart and dynamic sentences)

```jsx
export const parseData = createSelector([selectAlerts], (data) => {
  if (!data || isEmpty(data)) return null;
  // Get counts from each confidence category ['high', 'highest', 'nominal']
  const highAlertsData = data.filter((d) => d.confidence === 'high');
  const highestAlertsData = data.filter((d) => d.confidence === 'highest');
  const lowAlertsData = data.filter((d) => d.confidence === 'nominal');

  // Extract alert count from alerts key (default to 0 if not found)
  const highAlerts = highAlertsData.length ? highAlertsData[0].alerts : 0;
  const highestAlerts = highestAlertsData.length ? highestAlertsData[0].alerts : 0;
  const lowAlerts = lowAlertsData.length ? lowAlertsData[0].alerts : 0;

  // Total alerts
  const totalAlerts = highAlerts + highestAlerts + lowAlerts;

  // Return parsed data structure including percentage
return {
    totalAlertCount: totalAlerts,
    highAlertCount: highAlerts,
    highestAlertCount: highestAlerts,
    lowAlertCount: lowAlerts,
    highAlertPercentage: (100 * highAlerts) / totalAlerts,
    highestAlertPercentage: (100 * highestAlerts) / totalAlerts,
    lowAlertPercentage: (100 * lowAlerts) / totalAlerts,
  };
});
```

### 4b. Chart Config

Next we pass that data forward and create the chart config in the `parseConfig` selector function.

```jsx
export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;
```

Note that the `createSelector` function syntax allows the outputs of other selectors to be passed in. Functions are defined inside the `[]`, in this case: `parseData` (which we defined above), as well as `selectColors` and `getIndicator`. The outputs of those functions are assigned to values inside the `()` - here: `data`, `colors`, `indicator`.

<aside>
💡 Colours are defined in a static json `colors.json` and may need to be defined.

</aside>

```jsx
export const parseConfig = createSelector(
  [parseData, selectColors, getIndicator],
  (data, colors, indicator) => {
    if (isEmpty(data)) return null;

    const {
      highAlertCount,
      highestAlertCount,
      lowAlertCount,
      highAlertPercentage,
      highestAlertPercentage,
      lowAlertPercentage
    } = data;
    const lowAlertsLabel = indicator
      ? `Detection from one alert system in ${indicator.label}`
      : 'Detection from one alert system';

    const highAlertsLabel = indicator
      ? `Detection from one alert system (High-confidence) in ${indicator.label}`
      : 'Detection from one alert system (High-confidence)';
    
    const highestAlertsLabel = indicator
      ? `Detection from multiple alert systems in ${indicator.label}`
      : 'Detection from multiple alert systems';

    const highColour = colors.integratedHigh;
    const highestColour = colors.integratedHighest;
    const lowColour = colors.integratedLow;
		
		// Each slice of the pie assigned to a single element of the Array
    const parsedData = [
      {
        label: highestAlertsLabel,
        value: highestAlertCount,
        color: highestColour,
        percentage: highestAlertPercentage,
        unit: 'counts',
      },
      {
        label: highAlertsLabel,
        value: highAlertCount,
        color: highColour,
        percentage: highAlertPercentage,
        unit: 'counts',
      },
      {
        label: lowAlertsLabel,
        value: lowAlertCount,
        color: lowColour,
        percentage: lowAlertPercentage,
        unit: 'counts',
      },
    ];
    return parsedData;
  }
);
```

### 4c. Sentence Config

Finally, the `parseSentence` selector collects data, template sentences from the config in `index.js` and user settings to construct a sentence.

```jsx
export const parseSentence = createSelector(
  [parseData, getSettings, selectSentences, getIndicator, getLocationName],
  (data, settings, sentences, indicator, location) => {
    if (!data || isEmpty(data)) return null;

    const {totalAlertCount, highAlertPercentage, highestAlertPercentage} = data
    const startDate = settings.startDate;
    const endDate = settings.endDate;
    const formattedStartDate = moment(startDate).format('Do of MMMM YYYY');
    const formattedEndDate = moment(endDate).format('Do of MMMM YYYY');
    const params = {
      indicator: indicator && indicator.label,
      total: formatNumber({num: totalAlertCount, unit: ","}),
      highConfPerc: highAlertPercentage === 0
        ? 'none'
        : `${formatNumber({num: highAlertPercentage, unit: "%"})}`,
      highestConfPerc: highestAlertPercentage === 0
        ? 'none'
        : `${formatNumber({num: highestAlertPercentage, unit: "%"})}`,
      location,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      component: {
        key: 'individual alerts',
        fine: true,
        tooltip:
          'An individual alert may include one or more detections made by any of the the GLAD-Landsat, GLAD-S2, or RADD alert systems. While each individual system may have high or low confidence in a detection, agreement between systems is considered to represent overall confidence.',,
      },
    };
    return {
      sentence: indicator ? sentences.withInd : sentences.default,
      params,
    };
  }
);
```

## 5. Misc tweaks to widget Config

This particular widget needs some extra tweaks to the config in the widget config in `index.js`...

```jsx
types: ['country'], // Country level only for now (no 'geostore', 'wdpa', 'aoi', 'use')
  admins: ['adm0'], // Only available for BRA, COD isos (no  'adm1', 'adm2')
  datasets: [
    {
      dataset: POLITICAL_BOUNDARIES_DATASET,
      layers: [DISPUTED_POLITICAL_BOUNDARIES, POLITICAL_BOUNDARIES],
      boundary: true,
    },
    // // Replace with with 8bit Integrated Deforestation Layer when ready
    // {
    //   dataset: GLAD_DEFORESTATION_ALERTS_DATASET,
    //   layers: [GLAD_ALERTS],
    // },
  ],
  sortOrder: {
    summary: 999,
    forestChange: 999,
  },
  pendingKeys: [],
  refetchKeys: ['dataset','forestType', 'landCategory', 'startDate', 'endDate'],
  settingsConfig: [
    {
      key: 'forestType',
      label: 'Forest Type',
      type: 'select',
      placeholder: 'All tree cover',
      clearable: true,
    },
    {
      key: 'landCategory',
      label: 'Land Category',
      type: 'select',
      placeholder: 'All categories',
      clearable: true,
      border: true,
    },
    {
      key: 'dateRange',
      label: 'Range',
      endKey: 'endDate',
      startKey: 'startDate',
      type: 'datepicker',
    },
    {
      key: 'deforestationAlertsDataset',
      label: 'Alert type',
      type: 'select',
    },
  ],
  settingsBtnConfig: {
    text: '+ Select an intersection',
    shouldShowButton: (props) =>
      !props.settings.forestType &&
      !props.settings.landCategory &&
      !isMapPage(props?.location),
  },
  // where should we see this widget
  whitelists: {
    adm0: tropicalIsos,
  },
  // initial settings
  settings: {
    deforestationAlertsDataset: 'all',
  },
```

Most importantly, this widget needs a dataset selector to choose between the different alert types:

```jsx
{
      key: 'deforestationAlertsDataset',
      label: 'Alert type',
      type: 'select',
    },
```

This needs to be defined in `deforestation-alert-datasets.json` and `options.js` in order to be usable.