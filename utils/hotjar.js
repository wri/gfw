export const TOGGLE_PLANET_BASEMAP = 'planet-toggle';

export const triggerEvent = (event) => {
  // hotjar hack, refer to docs: https://help.hotjar.com/hc/en-us/articles/115015712548-How-to-Use-JavaScript-Triggers-to-Start-Recordings
  // Without this the event wont trigger on runtime
  /* eslint-disable */
  window.hj =
    window.hj ||
    function () {
      (hj.q = hj.q || []).push(arguments);
    };
  setTimeout(() => {
    hj('trigger', event);
  }, 1000);
  /* eslint-enable */
};
