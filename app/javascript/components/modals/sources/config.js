export default {
  uploads: {
    title: 'Upload a custom dataset',
    body:
      '<p>Drop a file in the designated area to analyze or subscribe to it. The recommended <strong>maximum file size is 1MB.</strong> Anything larger than that may not work properly.</p><p>NOTE: This feature counts alerts or hectares inside of polygons; therefore, <strong>only polygon data is supported,</strong> not point and line data. Please ensure that your file only contains polygon data. A maximum of 1,000 feautures can be analysed in a single upload, contained within a single layer. Multiple layers are not supported.</p><p><strong>List of supported file formats</strong>:</p><ul><li>Unzipped: .csv, .json, .geojson, .kml, .kmz (.csv files must contain a geom column of shape data converted to <a href="https://en.wikipedia.org/wiki/Well-known_text">well known text (WKT)</a> format).</li><li>Zipped: .shp (zipped shapefiles must include .shp, .shx, .dbf, and .prj files)</li></ul>'
  },
  lossDisclaimer: {
    title: 'Comparing Loss and Gain',
    body:
      '<p>Due to variation in research methodology and/or date of content, tree cover and tree cover loss and gain statistics cannot be compared against each other. Accordingly, “net” loss cannot be calculated by subtracting tree cover gain from tree cover loss, and current (or post-2000) tree cover cannot be determined by subtracting annual tree cover loss from year 2000 tree cover.</p><p>Please also be aware that “tree cover” does not equate to “forest cover.” “Tree cover” refers to the biophysical presence of trees, which may be a part of natural forests or tree plantations. Thus, loss of tree cover may occur for many reasons, including deforestation, fire, and logging within the course of sustainable forestry operations. Similarly, tree cover gain may indicate the growth of tree canopy within natural or managed forests.</p><p class="credits"><strong>Citation:</strong> Hansen, M. C., P. V. Potapov, R. Moore, M. Hancher, S. A. Turubanova, A. Tyukavina, D. Thau, S. V. Stehman, S. J. Goetz, T. R. Loveland, A. Kommareddy, A. Egorov, L. Chini, C. O. Justice, and J. R. G. Townshend. 2013. “High-Resolution Global Maps of 21st-Century Forest Cover Change.” Science 342 (15 November): 850–53. Data available on-line from: <a href="http://earthenginepartners.appspot.com/science-2013-global-forest" target="_blank">http://earthenginepartners.appspot.com/science-2013-global-forest</a>.</p><p class="credits"><strong>Suggested citations for data as displayed on GFW:</strong> Hansen, M. C., P. V. Potapov, R. Moore, M. Hancher, S. A. Turubanova, A. Tyukavina, D. Thau, S. V. Stehman, S. J. Goetz, T. R. Loveland, A. Kommareddy, A. Egorov, L. Chini, C. O. Justice, and J. R. G. Townshend. 2013. “Hansen/UMD/Google/USGS/NASA Tree Cover Loss and Gain Area.” University of Maryland, Google, USGS, and NASA. Accessed through Global Forest Watch on  [date]. <a href="https://www.globalforestwatch.org" target="_blank">www.globalforestwatch.org</a>.</p>'
  },
  webhookPreview: {
    title: 'Webhook URL.',
    body: `<h3>What is this feature?</h3><p>Webhooks are data sent on demand from one app (GFW) to another over HTTP(S) instead of through the command line in your computer, formatted in XML, JSON, or form-encoded serialization.</p><h3>What does the payload look like?</h3><p>We use the following standard:</p><p>All alerts include the following information:</p><div class="source_snippet"><pre><code>
  {
    <span class="json-key">layerSlug</span>: <span class="json-string">"layer slug"</span>,
    <span class="json-key">alert_name</span>: <span class="json-string">"subscription name"</span>,
    <span class="json-key">selected_area</span>: <span class="json-string">"area in meters"</span>,
    <span class="json-key">unsubscribe_url</span>: <span class="json-string">"url"</span>,
    <span class="json-key">subscriptions_url</span>: <span class="json-string">"url of the user subscriptions (../my_gfw/subscriptions)"</span>,
    <span class="json-key">alert_link</span>: <span class="json-string">"url of the map with the subscription"</span>,
    <span class="json-key">alert_date_begin</span>: <span class="json-string">"beginDate"</span>,
    <span class="json-key">alert_date_end</span>: <span class="json-string">"endDate"</span>
  }

</code></pre></div>`
  }
};
