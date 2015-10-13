define([
  'underscore'
], function(_) {

  // APP INFO
  // name: name of the app
  // svg: svg-id linked to svg icon definitions
  // content: content that will be shown when you click one app
  // source: the source of the app
  // tags: you should choose one of these => africa, asia, boreal-forests, commodities, crowdsourcing, data, fires, global-forest-watch, latin-america, maps, mining, mobile, palm-oil, satellite-imagery
  //       if you want more than once, please separate them by commas

  // LINK BUTTON
  // href: link to the app will be shown when you click one app
  // link_text: text that should appear inside the button
  // classname: classes that should have the link/button (mobile-friendly should prevent mobile users to leave GFW)
  // mobile_friendly: other => when you don't know if the app that is requested is mobile optimized. That should change the message
  // target: true if you need to open it in a new page

  var applicationsHelper = [
    {
      id: 1,
      name: 'GFW Interactive map',
      svg: '#shape-world',
      content: 'View and analyze data on the GFW Interactive Map.',
      href: '/map',
      link_text: 'Open map',
      classname: 'btn green medium',
      source: 'World Resources Institute',
      tags: 'data, fires, global-forest-watch, maps, mining, mobile, palm-oil, satellite-imagery'
    },
    {
      id: 2,
      name: 'Country profiles & rankings',
      svg: '#shape-country',
      content: 'View country-specific data, analyze forest change within a country or subnational jurisdiction, or view country rankings based on forest statistics.',
      href: '/countries',
      link_text: 'View countries',
      classname: 'btn green medium',
      source: 'World Resources Institute',
      tags: 'boreal-forests, data, global-forest-watch'
    },
    {
      id: 3,
      name: 'Open Data Portal',
      svg: '#shape-download',
      content: 'Browse, learn more about, and download the data displayed on Global Forest Watch.',
      href: 'http://data.globalforestwatch.org',
      link_text: 'Browse data',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags: 'data, fires, global-forest-watch, maps, mining, palm-oil, satellite-imagery'
    },
    {
      id: 4,
      name: 'Fires',
      svg: '#shape-fire',
      content: 'Track forest fires and haze in the ASEAN region.',
      href: 'http://fires.globalforestwatch.org/',
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags: 'asia, data, fires, global-forest-watch, maps, palm-oil, satellite-imagery'
    },
    {
      id: 5,
      name: 'Commodities',
      svg: '#shape-commodities',
      content: 'Identify deforestation risk in commodity supply chains.',
      href: 'http://commodities.globalforestwatch.org/',
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags: 'asia, commodities, data, fires, global-forest-watch, maps, mining, palm-oil'
    },
    {
      id: 6,
      name: 'Global Forest Watch: Sumatra campaign on Tomnod',
      svg: '#shape-tomnod',
      content: 'Help Global Forest Watch Fires track illegal fires and preserve the health of people and forests in Southeast Asia.',
      href: 'http://www.tomnod.com/campaign/gfw2_2014/map/2qwx1oy6u',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Digital Globe',
      mobile_friendly: 'other',
      tags: 'asia, crowdsourcing, data, fires, maps, palm-oil, satellite-imagery'
    },
    {
      id: 7,
      name: 'Open Landscape Partnership Platform',
      svg: '#shape-landscape',
      content: 'View and analyze ultra-high-resolution satellite imagery (up to 50 centimeters) for select forest landscapes.',
      href: 'http://www.openlandscape.info/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Transparent World',
      mobile_friendly: 'other',
      tags: 'crowdsourcing, data, maps, satellite-imagery'
    },
    {
      id: 8,
      name: 'Sustainable Palm Oil Transparency Toolkit (SPOTT)',
      svg: '#shape-spott',
      content: 'Assess oil palm growers on the information that they make publicly available about the sustainability of their operations.',
      href: 'http://www.openlandscape.info/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Zoological Society of London',
      mobile_friendly: 'other',
      tags: 'asia, commodities, data, global-forest-watch, maps, palm-oil'
    },
    {
      id: 9,
      name: 'Monitoring of the Andean Amazon Project (MAAP)',
      svg: '#shape-aca',
      content: 'View information, maps and analysis from a new deforestation monitoring system for the Andean Amazon.',
      href: 'http://maaproject.org/en/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Amazon Conservation Association',
      mobile_friendly: 'other',
      tags: 'data, latin-america, maps, mining, satellite imagery'
    },
    {
      id: 10,
      name: 'Cameroon Forest Atlas',
      svg: '#shape-CMR',
      content: 'View an interactive map with land-use data for Cameroon.',
      href: 'http://www.wri.org/applications/maps/forestatlas/cmr/index.htm#v=atlas&l=fr',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of Forest and Wildlife of Cameroon',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      id: 11,
      name: 'Central African Republic Forest Atlas',
      svg: '#shape-CAF',
      content: 'View an interactive map with land-use data for the Central African Republic.',
      href: 'http://www.wri.org/tools/atlas/map.php?maptheme=car',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of Water, Forests, Hunting, and Fishing of the Central African Republic',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps'
    },
    {
      id: 12,
      name: 'Republic of Congo Forest Atlas',
      svg: '#shape-COG',
      content: 'View an interactive map with land-use data for the Congo.',
      href: 'http://www.wri.org/tools/atlas/map.php?maptheme=congoforest',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of Economy and Sustainable Forestry Development of the Congo',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      id: 13,
      name: 'Democratic Republic of Congo Forest Atlas',
      svg: '#shape-COD',
      content: 'View an interactive map with land-use data for the Democratic Republic of the Congo.',
      href: 'http://www.wri.org/applications/maps/forestatlas/cod/index.htm#v=atlas&l=fr',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of Environment, Nature Conservation, and Tourism of the Democratic Republic of the Congo',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      id: 14,
      name: 'Equatorial Guinea Forest Atlas',
      svg: '#shape-GNQ',
      content: 'View an interactive map with land-use data for Equatorial Guinea.',
      href: 'http://www.wri.org/applications/maps/forestatlas/gnq/index.htm#v=atlas&l=es',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of Agriculture and Forestry of Equatorial Guinea',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps'
    },
    {
      id: 15,
      name: 'Gabon Forest Atlas',
      svg: '#shape-GAB',
      content: 'View an interactive map with land-use data for Gabon.',
      href: 'http://www.wri.org/applications/maps/forestatlas/gab/index.htm#v=atlas&l=fr&init=y',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Ministry of the Forest, Environment, and Protection of Natural Resources of Gabon',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      id: 16,
      name: 'Open Foris',
      svg: '#shape-open-foris',
      content: 'A set of free and open-source software tools that facilitates flexible and efficient data collection, analysis, and reporting.',
      href: 'http://www.openforis.org/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Forestry Department of the Food and Agriculture Organization of the United Nations',
      mobile_friendly: 'other',
      tags: 'crowdsourcing, data, maps, mobile, satellite-imagery'
    },
    {
      id: 17,
      name: 'GFW Climate',
      svg: '#shape-carbon',
      content: 'Track carbon emissions and removals in forest landscapes.',
      link_text: 'Coming soon',
      classname: 'btn soon',
      source: 'World Resources Institute',
      tags: 'data, global-forest-watch, maps'
    },
    {
      id: 18,
      name: 'Forest Watcher Mobile App',
      svg: '#shape-landsat',
      content: 'This easy-to-use app enables anyone with limited Internet connectivity to find GFW alerts in their forests and upload observations like photos and other data from the field. The Jane Goodall Institute, in partnership with Global Forest Watch, Google, and TouchLab, is currently piloting this app in Uganda to improve local forest monitoring.',
      link_text: 'Coming soon',
      classname: 'btn soon',
      source: 'World Resources Institute',
      tags: 'crowdsourcing, data, maps, mobile, satellite-imagery'
    },
    {
      id: 19,
      name: 'My Forest Atlas',
      svg: '#shape-my-forest-atlas',
      content: 'A tool for building your own online interactive map',
      link_text: 'Coming soon',
      classname: 'btn soon',
      source: 'World Resources Institute',
      tags: 'crowdsourcing, data, maps, mobile, satellite-imagery'
    },
    {
      id: 20,
      name: 'Develop your own app',
      svg: '#shape-develop',
      content: 'Learn how to develop your own application with Global Forest Watch data.',
      href: '/getinvolved/develop-your-own-app',
      link_text: 'Read more',
      classname: 'btn gray medium',
    },

  ]



// Add a card for "My Forest Atlas" (coming soon).  The source is WRI and the descriptive text should say: A tool for building your own online interactive map (text will probably change but this is good enough for now!).  See attached image for preliminary design.



  function tagged(arr) {
    return _.map(arr, function(app){
      if (app.tags) {
        app.tags = _.map(app.tags.split(","), function(t){
          return t.trim();
        });
      }
      return app;
    })
  }


  return tagged(applicationsHelper);

});

