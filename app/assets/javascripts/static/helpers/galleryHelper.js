define([
  'underscore'
], function(_) {

  // MAPS INFO
  // name: name of the app
  // svg: svg-id linked to svg icon definitions
  // content: content that will be shown when you click one app
  // source: the source of the app
  // tags: you should choose one of these => africa, asia, boreal-forests, commodities, crowdsourcing, data, fires, global-forest-watch, latin-america, maps, mining, mobile, palm-oil, satellite-imagery
  //       if you want more than once, please separate them by commas

  var mapsAtlasHelper = [
    {
      "title"         : "Atlas 10",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas10.html",
      "date"          : "2001-01-10 00:00:00 +0100",
      "order"         : "10",
      "thumbnail"     : "/assets/gallery/atlas9.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 9",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas9.html",
      "date"          : "2001-01-09 00:00:00 +0100",
      "order"         : "9",
      "thumbnail"     : "/assets/gallery/atlas9.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 8",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas8.html",
      "date"          : "2001-01-08 00:00:00 +0100",
      "order"         : "8",
      "thumbnail"     : "/assets/gallery/atlas8.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 7",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas7.html",
      "date"          : "2001-01-07 00:00:00 +0100",
      "order"         : "7",
      "thumbnail"     : "/assets/gallery/atlas7.jpg",
      "organization"  : "organization name",
      "filter"        : "wri3",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 6",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas6.html",
      "date"          : "2001-01-06 00:00:00 +0100",
      "order"         : "6",
      "thumbnail"     : "/assets/gallery/atlas6.jpg",
      "organization"  : "organization name",
      "filter"        : "wri3",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 5",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas5.html",
      "date"          : "2001-01-05 00:00:00 +0100",
      "order"         : "5",
      "thumbnail"     : "/assets/gallery/atlas5.jpg",
      "organization"  : "organization name",
      "filter"        : "wri2",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 4",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas4.html",
      "date"          : "2001-01-04 00:00:00 +0100",
      "order"         : "4",
      "thumbnail"     : "/assets/gallery/atlas4.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 3",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas3.html",
      "date"          : "2001-01-03 00:00:00 +0100",
      "order"         : "3",
      "thumbnail"     : "/assets/gallery/atlas3.jpg",
      "organization"  : "organization name",
      "filter"        : "wri2",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 2",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas2.html",
      "date"          : "2001-01-02 00:00:00 +0100",
      "order"         : "2",
      "thumbnail"     : "/assets/gallery/atlas2.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    },
    {
      "title"         : "Atlas 1",
      "category"      : "gallery",
      "tags"          : "",
      "url"           : "/gallery/gallery-atlas1.html",
      "date"          : "2001-01-01 00:00:00 +0100",
      "order"         : "1",
      "thumbnail"     : "/assets/gallery/atlas1.jpg",
      "organization"  : "organization name",
      "filter"        : "wri1",
      "content"       : "<p>GFW aims to radically improve the availability, quality, and accessibility of forest data for everyone:</p><ul>  <li>Governments can use GFW to detect illegal forest clearing and target forest law enforcement efforts.</li>  <li>Companies can monitor the impacts of commodity supply chains on forests and demonstrate compliance with sustainability commitments and certifications. Learn more at GFW Commodities.</li>  <li>NGOs &amp; civil society can identify deforestation hotspots and bolster their investigations, advocacy, and campaigns.</li>  <li>Indigenous communities can monitor their territories and raise an alarm when their customary forests are threatened.</li>  <li>Media can gather evidence, data, and graphics for reporting.</li>  <li>Researchers can analyze forest trends on a local or global scale and better understand the causes of forest change.</li>  <li>Concerned citizens everywhere can learn more about the state of forests and participate in forest monitoring. Students and educators can learn more about forests at local and global scales.</li></ul>"
    }]

  return mapsAtlasHelper;

});