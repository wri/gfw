define([], function() {

  var guideTexts = {
    default: {
      intro:            '<p>Welcome to the Global Forest Watch Interactive Map, where you can <strong>explore forest-related data sets, perform analyses</strong>, and <strong>subscribe to alerts</strong> for areas you are interested in. This walk-through guide will introduce you to some of the map’s main features.</p>' +
                        '<p>Already familiar with GFW? <a href="/map" class="js-skip-tour">Skip the walk through</a>.</p>',
      layersmenu_1:     '<p>By default, the map displays tree cover gain and loss data. <strong>Use the tabs at the top of the map to turn on other global data layers</strong>.</p>',
      layersmenu_2:     '<p>To learn more about a data set, click on the <strong>green information icon</strong> in the drop down menu.</p>',
      legend:           '<p>The data legend on the left side of the map shows which layers are activated. Use this legend to <strong>learn more about a data set, adjust the canopy density</strong> for tree cover layers, or <strong>turn data layers off.</strong></p>',
      mapcontrols:      '<p>Use this navigation panel to <strong>zoom in and out of the map, share a link</strong> of your map view, <strong>hide panels, search for a location</strong>, or <strong>refresh the page</strong>.</p>',
      countrytab:       '<p>Use the <strong>Country Data feature</strong> in the panel on the right side of the map to <strong>view country-specific datasets</strong>. Select a country and then turn on local datasets you’re interested in.</p>',
      analysistab:      '<p>Click the <strong>Analyze and Subscribe icon</strong> to <strong>perform an analysis or subscribe to alerts</strong> for a drawn or uploaded shape, a country or subnational region, or for a polygon in another data layer.</p>',
      hrestab:          '<p>The <strong>UrtheCast feature</strong> gives you access to <strong>high resolution satellite imagery</strong>. Zoom in to an area on the map and select a date range to view the latest imagery available. You can also use the advanced settings to filter by maximum cloud coverage or apply a renderer.</p>',
      basemaptab:       '<p>Click on the <strong>Basemap icon</strong> to <strong>change the default map layer</strong>. You can choose from terrain, satellite imagery, roads, and many more.</p>',
      timeline:         '<p>Use the <strong>timeline</strong> on the bottom of the map to <strong>animate forest change data sets over time</strong> by pressing the play button. You can also <strong>select a time interval to view or analyze</strong> by dragging the ends of the timeline to a specific time period.</p>',
      howto:            '<p>For more information about how to use any of the features on the Interactive Map, <strong>visit our <a href="/howto">How-To</a> page</strong>.</p>'     
    },

    glad: {
      intro:            '<p>Welcome to the Interactive Map! This walk-through will show you <strong>how to subscribe to GLAD Tree Cover Loss Alerts.</strong></p>' +
                        '<p>Already familiar with GFW? <a href="/map" class="js-skip-tour">Skip the walk through</a>.</p>',
      layersmenu_1:     '<p>First, select <strong>GLAD Tree Cover Loss Alerts</strong> from the <strong>Forest Change</strong> drop down menu.</p>',
      legend:           '<p>Then zoom in to one of the areas covered by GLAD Alerts – Peru, the Republic of Congo, or Kalimantan.</p>',
      analysistab_1:    '<p>Click on the <strong>Analyze and Subscribe icon</strong> to select an area that you want to subscribe to. There are several ways to define your area of interest.</p>',
      analysistab_2:    '<p>For example, you can draw or upload a custom shape. <strong>Click “Start Drawing”</strong> to outline an area on the map, <strong>or select a file from your computer</strong>. Once your area is defined on the map, click on the <strong>green Subscribe button</strong> to sign up to receive notifications when new GLAD Alerts are detected.</p>' + 
                        '<p><strong>Note</strong>: You will only be subscribed to GLAD Alerts if they are activated on the map.</p>',
      analysistab_3:    '<p>You will be prompted to <strong>log in to My GFW</strong> using your Facebook, Twitter, or Google account and create a profile. Then you can enter the email address where you would like to receive alerts, and name your area.</p>' + 
                        '<p><strong>Note</strong>: You will receive an email from GFW asking you to confirm your subscription. You must confirm your subscription to save it.</p>',
      analysistab_4:    '<p>You can also select a <strong>country or subnational region</strong> (Peru, the Republic of Congo, or Kalimantan, Indonesia), or a <strong>shape from another data layer</strong> (like Protected Areas), to subscribe to.</p>',
      log_in:           '<p>Once you subscribe, you can <strong>view and manage your subscriptions</strong> through the <strong>My GFW</strong> feature.</p>',
      intro2:           '<p>Interested in learning more?</p>' + 
                        '<p>You can also <strong class="js-next-button">Analyze and Download</strong> GLAD Tree Cover Loss Alerts.</p>' +
                        '<p>Or <a href="/map" class="js-skip-tour">End Walk Through</a></p>',
      analysistab_5:    '<p><strong>Analyze</strong> GLAD Alerts for your area of interest by clicking the <strong>green Analyze button</strong> once you have defined an area on the map.</p>' + 
                        '<p><strong>Reminder</strong>: you can define an area by drawing or uploading a custom shape, selecting a country or subnational region, or clicking on an individual shape from another data layer.</p>',
      timeline:         '<p>Use the <strong>time selector</strong> at the bottom of the map to change the time interval that you want to analyze.</p>' +
                        '<p><strong>Note</strong>: dates with a green dot below them indicate that GLAD Alerts were detected on those days.</p>',
      analysistab_6:    '<p>Once you have completed an analysis, you can <strong>download GLAD Alerts</strong> for your area of interest by clicking on the “Download and Export Data” icon. The analysis can be downloaded in the following file formats: SVG, GeoJSON, SHP, KML, CSV, or opened in Carto DB.</p>'
    }
  }
  return guideTexts;

});

