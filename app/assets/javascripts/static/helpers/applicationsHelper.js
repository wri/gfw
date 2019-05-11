/* eslint-disable */
define(['underscore'], function(_) {
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
      name: 'GFW Interactive Map',
      svg: '#shape-world',
      content: 'View and analyze data on the GFW Interactive Map.',
      href: '/map',
      link_text: 'Open map',
      classname: 'btn green medium',
      source: 'World Resources Institute',
      tags:
        'data, fires, global-forest-watch, maps, mining, mobile, palm-oil, satellite-imagery'
    },
    {
      name: 'Countries',
      svg: '#shape-country',
      content:
        'View country-specific data, analyze forest change within a country or subnational jurisdiction, or view country rankings based on forest statistics.',
      href: '/countries',
      link_text: 'View countries',
      classname: 'btn green medium',
      source: 'World Resources Institute',
      tags: 'boreal-forests, data, global-forest-watch'
    },
    {
      name: 'Open Data Portal',
      svg: '#shape-download',
      content:
        'Browse, learn more about, and download the data displayed on Global Forest Watch.',
      href: 'http://data.globalforestwatch.org',
      link_text: 'Browse data',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags:
        'data, fires, global-forest-watch, maps, mining, palm-oil, satellite-imagery'
    },
    {
      name: 'Fires',
      svg: '#shape-fire',
      content: 'Track forest fires and haze in the ASEAN region.',
      href: 'http://fires.globalforestwatch.org/',
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags:
        'asia, data, fires, global-forest-watch, maps, palm-oil, satellite-imagery'
    },
    {
      name: 'Commodities',
      svg: '#shape-commodities',
      content: 'Identify deforestation risk in commodity supply chains.',
      href: 'http://commodities.globalforestwatch.org/',
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags:
        'asia, commodities, data, fires, global-forest-watch, maps, mining, palm-oil'
    },
    {
      name: 'Climate',
      svg: '#shape-climate',
      content: 'Track carbon emissions and removals in forest landscapes.',
      href: 'http://climate.globalforestwatch.org/',
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute',
      tags: 'data, global-forest-watch, maps'
    },
    {
      name: 'Global Forest Watch: Sumatra campaign on Tomnod',
      svg: '#shape-tomnod',
      content:
        'Help Global Forest Watch Fires track illegal fires and preserve the health of people and forests in Southeast Asia.',
      href: 'http://www.tomnod.com/campaign/gfw2_2014/map/2qwx1oy6u',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Digital Globe',
      mobile_friendly: 'other',
      tags:
        'asia, crowdsourcing, data, fires, maps, palm-oil, satellite-imagery'
    },
    {
      name: 'Open Landscape Partnership Platform',
      svg: '#shape-landscape',
      content:
        'View and analyze ultra-high-resolution satellite imagery (up to 50 centimeters) for select forest landscapes.',
      href: 'http://www.openlandscape.info/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Transparent World',
      mobile_friendly: 'other',
      tags: 'crowdsourcing, data, maps, satellite-imagery'
    },
    {
      name: 'Sustainable Palm Oil Transparency Toolkit (SPOTT)',
      svg: '#shape-spott',
      content:
        'Assess oil palm growers on the information that they make publicly available about the sustainability of their operations.',
      href: 'http://www.sustainablepalmoil.org/spott',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Zoological Society of London',
      mobile_friendly: 'other',
      tags: 'asia, commodities, data, global-forest-watch, maps, palm-oil'
    },
    {
      name: 'Monitoring of the Andean Amazon Project (MAAP)',
      svg: '#shape-aca',
      content:
        'View information, maps and analysis from a new deforestation monitoring system for the Andean Amazon.',
      href: 'http://maaproject.org/en/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Amazon Conservation Association',
      mobile_friendly: 'other',
      tags: 'data, latin-america, maps, mining, satellite imagery'
    },
    {
      name: 'Cameroon Forest Atlas',
      svg: '#shape-CMR',
      content: 'View an interactive map with land-use data for Cameroon.',
      href: 'http://cmr.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of Forest and Wildlife of Cameroon',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      name: 'Central African Republic Forest Atlas',
      svg: '#shape-CAF',
      content:
        'View an interactive map with land-use data for the Central African Republic.',
      href: 'http://caf.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of Water, Forests, Hunting, and Fishing of the Central African Republic',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps'
    },
    {
      name: 'Republic of Congo Forest Atlas',
      svg: '#shape-COG',
      content: 'View an interactive map with land-use data for the Congo.',
      href: 'http://cog.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of Economy and Sustainable Forestry Development of the Congo',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      name: 'Democratic Republic of Congo Forest Atlas',
      svg: '#shape-COD',
      content:
        'View an interactive map with land-use data for the Democratic Republic of the Congo.',
      href: 'http://cod.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of Environment, Nature Conservation, and Tourism of the Democratic Republic of the Congo',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      name: 'Equatorial Guinea Forest Atlas',
      svg: '#shape-GNQ',
      content:
        'View an interactive map with land-use data for Equatorial Guinea.',
      href: 'http://gnq.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of Agriculture and Forestry of Equatorial Guinea',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps'
    },
    {
      name: 'Gabon Forest Atlas',
      svg: '#shape-GAB',
      content: 'View an interactive map with land-use data for Gabon.',
      href: 'http://gab.forest-atlas.org',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'World Resources Institute and Ministry of the Forest, Environment, and Protection of Natural Resources of Gabon',
      mobile_friendly: 'other',
      tags: 'africa, data, global-forest-watch, maps, mining'
    },
    {
      name: 'Open Foris',
      svg: '#shape-open-foris',
      content:
        'A set of free and open-source software tools that facilitates flexible and efficient data collection, analysis, and reporting.',
      href: 'http://www.openforis.org/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source:
        'Forestry Department of the Food and Agriculture Organization of the United Nations',
      mobile_friendly: 'other',
      tags: 'crowdsourcing, data, maps, mobile, satellite-imagery'
    },
    {
      name: 'Forest Watcher Mobile App',
      svg: '#shape-globe-mobile',
      content:
        'This easy-to-use app enables anyone with limited Internet connectivity to find GFW alerts in their forests and upload observations like photos and other data from the field. The Jane Goodall Institute, in partnership with Global Forest Watch, Google, and TouchLab, is currently piloting this app in Uganda to improve local forest monitoring. The beta version is now live!.',
      href: 'mailto:gfw@wri.org',
      target: true,
      link_text: 'Contact us to become a beta tester',
      classname: 'btn green medium mobile-friendly',
      source:
        'Jane Goodall Institute, Google, TouchLab, and World Resources Institute',
      tags: 'crowdsourcing, data, maps, mobile, satellite-imagery'
    },
    {
      name: 'Logging Roads',
      svg: '#shape-logging-roads',
      content:
        'View and help document the spread of logging roads across the Congo Basin region of Central Africa',
      href: 'http://loggingroads.org/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'World Resources Institute and Moabi',
      mobile_friendly: 'other',
      tags:
        'crowdsourcing, maps, satellite imagery, Africa, data, Global Forest Watch, logging'
    },
    {
      name: 'Develop your own app',
      svg: '#shape-develop',
      content:
        'Learn how to develop your own application with Global Forest Watch data.',
      href: '/developers-corner/',
      link_text: 'Read more',
      classname: 'btn gray medium'
    },
    {
      name: 'Protecting forests & peatlands in Indonesia',
      svg: '#shape-GAB',
      content:
        'Explore the relationship between company concessions, peatlands, fire hotspots, and deforestation alerts in Indonesia.',
      href:
        'http://www.greenpeace.org/seasia/id/Global/seasia/Indonesia/Code/Forest-Map/en/',
      target: true,
      link_text: 'Launch App',
      classname: 'btn green medium mobile-friendly',
      source: 'Greenpeace',
      mobile_friendly: 'other',
      tags: 'asia, commodities, palm oil, mining, fires, maps'
    }
  ];

  function tagged(arr) {
    return _.map(arr, function(app) {
      if (app.tags) {
        app.tags = _.map(app.tags.split(','), function(t) {
          return t.trim();
        });
      }
      return app;
    });
  }

  return tagged(applicationsHelper);
});
