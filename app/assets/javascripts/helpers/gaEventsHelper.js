define([], function() {

  /**
  * GA events helper
  */

  var gaEventsHelper = {

    /**
     * Returns the event's data
     * @param {Array} subscriptions params
     * @returns {String} Event data
     */
    getSubscription: function(params) {
      var eventData = '';
      if (params) {
        var eventData = '';

        if (params.wdpaid) {
          eventData = 'Protected Area ' + params.wdpaid;
        }

        if (params.useid) {
          eventData = 'Use ' + params.use + ' ' + params.useid;
        }

        if (params.iso && params.iso.country) {
          eventData = 'Country ' + params.iso.country;
        }

        if (params.iso && params.iso.region) {
          eventData = 'Country ' + params.iso.country + ' region ' + params.iso.region;
        }
      }
      return eventData;
    }
  }
  return gaEventsHelper;

});
