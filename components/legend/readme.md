### Components available
<pre>
import {
  // Legend
  Legend,

  // Toolbar
  LegendItemToolbar,
  LegendItemButtonBBox,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,

  // Types
  LegendItemTypes,
  LegendItemTypeBasic,
  LegendItemTypeChoropleth,
  LegendItemTypeGradient,
  LegendItemTypeProportional

  // timestep
  LegendItemTimestep

} from 'vizzuality-components';
</pre>

### Types

#### Basic

```json
{
  type: 'basic',
  items: [
    {
      name: 'Riots/Protests',
      color: '#cab2d6'
    },
    {
      name: 'Violence against civilians',
      color: '#8dd3c7'
    },
    {
      name: 'Battle-No change of territory',
      color: '#b15928'
    },
    {
      name: 'Remote violence',
      color: '#e31a1c'
    },
    {
      name: 'Strategic development',
      color: '#fb9a99'
    },
    {
      name: 'Battle-Government regains territory',
      color: '#33a02c'
    },
    {
      name: 'Battle-Non-state actor overtakes territory',
      color: '#b2df8a'
    },
    {
      name: 'Non-violent transfer of territory',
      color: '#1f78b4'
    },
    {
      name: 'Headquarters or base established',
      color: '#a6cee3'
    }
  ]
}
```

#### Choropleth
```json
{
  type: 'choropleth',
  items: [
    {
      name: '0 h',
      color: '#FFFFFF'
    }, {
      color: '#C0F09C',
      name: '1 h'
    }, {
      color: '#E3DA64',
      name: '2 h'
    }, {
      color: '#D16638',
      name: '3 h'
    }, {
      color: '#BA2D2F',
      name: '6 h'
    }, {
      color: '#A11F4A',
      name: '12 h'
    }, {
      color: '#730D6F',
      name: '1 d'
    }, {
      color: '#0D0437',
      name: '14 d'
    }, {
      color: '#00030F',
      name: '1 m'
    }
  ]
}
```

#### Gradient
```json
{
  type: 'gradient',
  items: [
    {
      color: '#fef0d9',
      name: '1%'
    }, {
      color: '#fef0d9',
      name: '20%'
    }, {
      color: '#fdbb84',
      name: '40%'
    }, {
      color: '#fc8d59',
      name: '60%'
    }, {
      color: '#e34a33',
      name: '80%'
    }, {
      color: '#b30000',
      name: '100%'
    }, {
      color: '#7f0000',
      name: 'Urban'
    }
  ]
}
```

### Legend
```jsx
const layerGroups = require('./mocks').layerGroups;

const LegendListItem = require('./components/legend-list-item').default;
const LegendItemToolbar = require('./components/legend-item-toolbar').default;
const LegendItemTypes = require('./components/legend-item-types').default;
const LegendItemButtonVisibility = require('./components/legend-item-toolbar/legend-item-button-visibility').default;
const LegendItemTimestep = require('./components/legend-item-timestep').default;

const layerGroupsParsed = layerGroups.map(lg => ({
  ...lg,
  layers: lg.layers.map(layer => ({
    ...layer,
    ...layer.layerConfig && layer.layerConfig.timeline_config && {
      timelineParams: {
        ...layer.layerConfig.timeline_config,
        canPlay: false,
        minDate: "2001-01-01",
        maxDate: "2017-12-31",
        startDate: "2004-09-27",
        endDate: "2010-09-14",
        trimEndDate: "2016-09-14"
      }
    }
  }))
}));

<Legend
  onChangeOrder={(datasetIds) => { console.info(datasetIds)}}
>
  {layerGroupsParsed.map((lg, i) => (
    <LegendListItem
      index={i}
      key={lg.dataset}
      layerGroup={lg}
      toolbar={<LegendItemToolbar />}
    >
      <LegendItemTypes />
      <LegendItemTimestep
        handleChange={dates => {}}
        trackStyle={[
          {
            backgroundColor: '#c32d7b',
            borderRadius: '0px'
          },
          {
            backgroundColor: '#F660AE',
            borderRadius: '0px'
          }
        ]}
      />
    </LegendListItem>
  ))}
</Legend>
```

### Max width & max height legend
```jsx
const layerGroups = require('./mocks').layerGroups;

const LegendListItem = require('./components/legend-list-item').default;
const LegendItemToolbar = require('./components/legend-item-toolbar').default;
const LegendItemTypes = require('./components/legend-item-types').default;
const LegendItemTimestep = require('./components/legend-item-timestep').default;

const layerGroupsParsed = layerGroups.map(lg => ({
  ...lg,
  layers: lg.layers.map(layer => ({
    ...layer,
    ...layer.layerConfig && layer.layerConfig.timeline_config && {
      timelineParams: {
        ...layer.layerConfig.timeline_config,
        canPlay: true,
        minDate: "2001-01-01",
        maxDate: "2017-12-31",
        startDate: "2004-09-27",
        endDate: "2010-09-14",
        trimEndDate: "2016-09-14"
      }
    }
  }))
}));

<Legend
  maxWidth={500}
  maxHeight={300}
>
  {layerGroupsParsed.map((lg, i) => (
    <LegendListItem
      index={i}
      key={lg.dataset}
      layerGroup={lg}
      toolbar={
        <LegendItemToolbar />
      }
    >
      <LegendItemTypes />
      <LegendItemTimestep
        handleChange={dates => {}}
        trackStyle={[
          {
            backgroundColor: '#c32d7b',
            borderRadius: '0px'
          },
          {
            backgroundColor: '#F660AE',
            borderRadius: '0px'
          }
        ]}
      />
    </LegendListItem>
  ))}
</Legend>
```


### Not draggable legend
```jsx
const layerGroups = require('./mocks').layerGroups;

const LegendListItem = require('./components/legend-list-item').default;
const LegendItemToolbar = require('./components/legend-item-toolbar').default;
const LegendItemTypes = require('./components/legend-item-types').default;
const LegendItemTimestep = require('./components/legend-item-timestep').default;

const layerGroupsParsed = layerGroups.map(lg => ({
  ...lg,
  layers: lg.layers.map(layer => ({
    ...layer,
    ...layer.layerConfig && layer.layerConfig.timeline_config && {
      timelineParams: {
        ...layer.layerConfig.timeline_config,
        canPlay: true,
        minDate: "2001-01-01",
        maxDate: "2017-12-31",
        startDate: "2004-09-27",
        endDate: "2010-09-14",
        trimEndDate: "2016-09-14"
      }
    }
  }))
}));

<Legend
  sortable={false}
>
  {layerGroupsParsed.map((lg, i) => (
    <LegendListItem
      index={i}
      key={lg.dataset}
      layerGroup={lg}
      toolbar={
        <LegendItemToolbar />
      }
    >
      <LegendItemTypes />
      <LegendItemTimestep
        handleChange={dates => {}}
        trackStyle={[
          {
            backgroundColor: '#c32d7b',
            borderRadius: '0px'
          },
          {
            backgroundColor: '#F660AE',
            borderRadius: '0px'
          }
        ]}
      />
    </LegendListItem>
  ))}
</Legend>
```

### Collapsed legend
```jsx
const layerGroups = require('./mocks').layerGroups;

const LegendListItem = require('./components/legend-list-item').default;
const LegendItemToolbar = require('./components/legend-item-toolbar').default;
const LegendItemTypes = require('./components/legend-item-types').default;
const LegendItemTimestep = require('./components/legend-item-timestep').default;

const layerGroupsParsed = layerGroups.map(lg => ({
  ...lg,
  layers: lg.layers.map(layer => ({
    ...layer,
    ...layer.layerConfig && layer.layerConfig.timeline_config && {
      timelineParams: {
        ...layer.layerConfig.timeline_config,
        canPlay: true,
        minDate: "2001-01-01",
        maxDate: "2017-12-31",
        startDate: "2004-09-27",
        endDate: "2010-09-14",
        trimEndDate: "2016-09-14"
      }
    }
  }))
}));

<Legend
  expanded={false}
  sortable={false}
>
  {layerGroupsParsed.map((lg, i) => (
    <LegendListItem
      index={i}
      key={lg.dataset}
      layerGroup={lg}
      toolbar={
        <LegendItemToolbar />
      }
    >
      <LegendItemTypes />
      <LegendItemTimestep
        handleChange={dates => {}}
        trackStyle={[
          {
            backgroundColor: '#c32d7b',
            borderRadius: '0px'
          },
          {
            backgroundColor: '#F660AE',
            borderRadius: '0px'
          }
        ]}
      />
    </LegendListItem>
  ))}
</Legend>
```
