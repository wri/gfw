//= require jquery
//= require jquery_ujs
//= require geojson
//= require gfw
//= require helpers

$(function() {
  try {
    // Loads the WRI Global Nav Bar
    wri_global_nav({
      string: "A partnership convened by the <a href='http://www.wri.org' target='_blank'>World Resources Institute</a>",
      disabled: true
    });

  } catch(err) {
  }
});
