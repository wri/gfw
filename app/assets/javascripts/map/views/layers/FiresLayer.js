/**
 * The Fires layer module.
 *
 * @return FiresLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var FiresLayer = CartoDBLayerClass.extend({
  });

  return FiresLayer;

});

//  sql: "SELECT * FROM global_7d"// where acq_date > '2014-07-07' AND CAST(confidence AS INT)> 30"
