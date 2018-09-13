export default {
  uploads: {
    title: 'UPLOAD A CUSTOM DATA SET',
    body:
      '<p>Drop a file in the designated area to analyze or subscribe to it. The recommended <strong>maximum file size is 1MB.</strong> Anything larger than that may not work properly.</p><p>NOTE: This feature counts alerts or hectares inside of polygons; therefore, <strong>only polygon data is supported,</strong> not point and line data. Please ensure that your file only contains polygon data. A maximum of 1,000 feautures can be analysed in a single upload, contained within a single layer. Multiple layers are not supported.</p><p><strong>List of supported file formats</strong>:</p><ul><li>Unzipped: .csv, .json, .geojson, .kml, .kmz (.csv files must contain a geom column of shape data converted to <a href="https://en.wikipedia.org/wiki/Well-known_text">well known text, WKT</a>, format).</li><li>Zipped: .shp (zipped shapefiles must include .shp, .shx, .dbf, and .prj files)</li></ul>'
  }
};
