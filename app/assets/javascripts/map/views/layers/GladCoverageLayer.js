define(['abstract/layer/CartoDBLayerClass'], CartoDBLayerClass => {
  const GladCoverageLayer = CartoDBLayerClass.extend({
    options: {
      sql:
        "SELECT *, '{tableName}' AS layer, '{tableName}' AS name FROM {tableName}"
    }
  });

  return GladCoverageLayer;
});
