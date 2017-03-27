define([], function() {

  var guideTexts = {
    default: {
      intro:            '<p>Welcome to the Global Forest Watch Interactive Map. This quick guide will introduce you to the map’s main features and tools.</p>' +
                        '<p>Already familiar with GFW? <a href="/map" class="js-skip-tour">Skip the walk through</a>.</p>',
      layersmenu_1:     '<p>By default, the map displays tree cover gain and loss data. <strong>Use the menus at the top of the map to turn on other global data layers.</strong></p>' +
                        '<p>Click on the <strong>green information icon</strong> to learn more about any data set or to download data.</p>',
      legend:           '<p>This legend shows <strong>which data layers are currently activated.</strong> Click the “x” to turn off a data layer.</p>',
      mapcontrols:      '<p>Use this panel to <strong>navigate around the map using the zoom</strong> or <strong>search icons</strong>, <strong>share a link</strong> of your map view, <strong>hide panels</strong>, or <strong>refresh</strong> the page.</p>',
      analysistab:      '<p>Using these tabs you can:</p>' +
                        '<ul>' +
                          '<li><strong>Perform an analysis or subscribe to alerts</strong> for a specific area of interest</li>' +
                          '<li><strong>Change the base map</strong> to see terrain, satellite imagery, roads, and more</li>' +
                          '<li>View <strong>high resolution satellite imagery</strong> from Sentinel-hub</li>' +
                        '</ul>',
      timeline:         '<p><strong>Press play</strong> on the timeline to <strong>view forest change data sets over time</strong>, or <strong>select a specific time interval</strong> by dragging the ends of the timeline.</p>',
      howto:            '<p>For more information about how to use the GFW Interactive Map, <strong>visit our <a href="/howto">How To page</a></strong>.</p>'
    },

    glad: {
      intro:            '<p>Welcome to the <strong>Global Forest Watch Interactive Map</strong>, where you can monitor tree clearing in Brazil and around the world. This short tour will teach you how to use the map to <strong>view, analyze, and subscribe to notifications</strong> for <strong>GLAD alerts in Brazil</strong>: the most up-to-date data on where trees are being lost.</p>',
      layersmenu_1:     '<p>First, select <strong>GLAD alerts</strong> from the <strong>Forest Change</strong> menu to see where loss is happening. Click on the green information icon to learn more about the data set.</p>',
      timeline:         '<p>You can change the <strong>start and end dates</strong> for the data you want to display on the map using the calendar. Click the play button to animate the data over time.</p>',
      analysistab_1:    '<p><strong>Analyze</strong> how many GLAD alerts occurred in a custom area by <strong>drawing a shape</strong> in the map. Your analysis results will show up here. Use the calendar to change the dates of your analysis.</p>',
      analysistab_2:    '<p>To receive notifications when new GLAD Alerts are detected in your custom area, click <strong>Subscribe</strong>. You will be prompted to <strong>log in to My GFW</strong> using a Facebook, Twitter, or Google+ account. Then you can enter the email address where you want to receive your alerts and name your area.</p>',
      analysistab_3:    '<p>You can also analyze or subscribe to a <strong>country or subnational region</strong></p>',
      analysistab_4:    '<p>Or to <strong>a shape</strong> from another data layer using the tabs at the top of the map (ex. Land Use, Conservation, People)</p>',
      highresolutiontab:'<p>View the latest <strong>high resolution satellite imagery</strong> to verify alerts here.</p>'+
                        '<p>To learn more about how you can use Global Forest Watch to monitor forests, visit our <a href="/howto">How to Portal.</a></p>',
    }
  }
  return guideTexts;

});


