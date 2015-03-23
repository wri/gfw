var AnalysisServiceResponse = {
  fires: {
    "apis": {
      "national": "http://beta.gfw-apis.appspot.com/nasa-active-fires/admin{/iso}{?period,download,bust,dev}",
      "subnational": "http://beta.gfw-apis.appspot.com/nasa-active-fires/admin{/iso}{/id1}{?period,download,bust,dev}",
      "use": "http://beta.gfw-apis.appspot.com/nasa-active-fires/use/{/name}{/id}{?period,download,bust,dev}",
      "wdpa": "http://beta.gfw-apis.appspot.com/nasa-active-fires/wdpa/{/id}{?period,download,bust,dev}",
      "world": "http://beta.gfw-apis.appspot.com/nasa-active-fires{?period,geojson,download,bust,dev}"
    },
    "download_urls": {
      "csv": "http://wri-01.cartodb.com/api/v2/sql?q=TODO&format=csv",
      "geojson": "http://wri-01.cartodb.com/api/v2/sql?q=TODO&format=geojson",
      "kml": "http://wri-01.cartodb.com/api/v2/sql?q=TODO&format=kml",
      "shp": "http://wri-01.cartodb.com/api/v2/sql?q=TODO&format=shp",
      "svg": "http://wri-01.cartodb.com/api/v2/sql?q=TODO&format=svg"
    },
    "meta": {
      "coverage": "Global",
      "description": "Displays fire alert data for the past 7 days.",
      "id": "nasa-active-fires",
      "name": "NASA Active Fires",
      "resolution": "1 x 1 kilometer",
      "source": "MODIS",
      "timescale": "Last 7 days",
      "units": "Alerts",
      "updates": "Daily"
    },
    "params": {
      "begin": "2014-09-01",
      "end": "2014-09-02",
      "geojson": {
        "coordinates": [
          [
            [-71.0156, 11.6953],
            [-94.9219, -14.094],
            [-58.7109, -23.725],
            [-38.8477, -7.0137],
            [-47.9883, 14.9448],
            [-71.7188, 20.4682],
            [-71.0156, 11.6953]
          ]
        ],
        "type": "Polygon"
      }
    },
    "period": "Past 24 hours",
    "value": 4004
  }
};
