param list:

## Dashboards

3 Template ids:
`dashboard-pending-${lang}-copy`
`dashboard-complete-${lang}-copy`
`subscription-preference-change-${lang}-copy`

The following parameters are provided:
`id `: the ID of the AOI.
`name` : the name of the AOI.
`location` : an alias for the name of the AOI (contains the same as the name parameter).
`tags` : string with tags separated by commas and space (e.g. "tag1, tag2, tag3") for the AOI tags, if any.
`subscriptions_url` : the URL to manage your subscriptions, probably /my-gfw or whichever we use for unsubscribe settings.
`dashboard_link` : the link to the AOI dashboard (example: https://staging.globalforestwatch.org/dashboards/aoi/5d517b3fb8cfd4001061d0b2).
`map_link` : the "view on map" for the AOI (example: https://staging.globalforestwatch.org/map/aoi/5d517b3fb8cfd4001061d0b2).
`image_url` : the URL for the image associated with the AOI.

## Summary templates (2), new params:
`image_url_big` : same AOI image as before, but now 350px tall and 700px wide.
`image_source` : image credit and date, if any.
`month`: summary month, text (e.g. December)
`year`: summary year (e.g. 2019)
`week_of`: day of the alert? not sure. e.g. "25th of December",
`week_start`: first day of the week for that day (`week_of`), e.g. "12/23/2019",
`week_end`: last day of the week for that day, e.g. "12/29/2019",

`priority_areas`: distribution of alerts. First row of bubbles, this variable is an object. e.g.:
  { 
      "intact_forest": 1,
      "primary_forest": 1,
      "peat": 0,
      "protected_areas": 12,
      "plantations": 15,
      "other": 3
  }

`glad_count`: number of GLAD alerts, e.g. 20,
`glad_image_url` : satellite image of the GLAD alerts,
`glad_chart_url` : image of the chart we usually see in the dashboard
`glad_frequency` : frequency of the alerts, like "low", "unusually high", etc.
`glad_alerts` : object with the data for the bubbles (number of alerts). This variable, like the priority areas, is an object. e.g.:
    {
      "confirmed": 3,
      "unconfirmed": 1,
      "intact_forest": 1,
      "primary_forest": 1,
      "peat": 0,
      "protected_areas": 12
    }

`viirs_count`: number of VIIRS alerts, e.g. 13,
`viirs_days_count` : number of days the alert covers, e.g. 2 (context: There were 13 VIIRS fire alerts reported in the past {2} days)
`viirs_day_start` : day in which the alert begins to count ? e.g. "9/12/2019"
`viirs_day_end` :   day in which the alert finishes counting e.g. "9/14/2019"
`viirs_frequency` : frequency of the alerts, like "low", "unusually high", etc.
`viirs_image_url` : satellite image of the VIIRS alerts,
`viirs_chart_url` : image of the chart we usually see in the dashboard
`viirs_alerts` : object with the data for the bubbles (number of alerts). This variable, like the priority areas and GLADS, is an object. e.g.:
    {
      "low": 1,
      "medium": 1,
      "high": 0,
      "intact_forest": 1,
      "primary_forest": 1,
      "peat": 0,
      "protected_areas": 12
    }

`alerts`: array of objects that will go into the email table, e.g.:
 [
      {
        "alert_type": "GLAD" or VIIRS,
        "date": "09/12/2019 06:25 UTC",
        "lat_long": "6,123 / 101.455",
        "confidence": "13 (low)" (this last param is only for VIIRS)
      },
    ]

`more_items`: number of alerts ? (rows of the table) minus the ones we're showing. Used to show "{more_items} MORE ITEMS" below the table. e.g. if there are 128 rows and we show max 5 in the table, more_items should be 123.
`csv_link` : we use this to trigger the download of the data we see in the table.

