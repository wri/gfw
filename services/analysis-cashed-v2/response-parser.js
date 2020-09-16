/**
  * @object response parsers
  * @description
  * Each widget response has a different structure,
  * here we can define some custom parsing when needed for a widget,
  * This is called in AnalysisService.getData.
  * If no parser is defined, we simply return the default condition
* */
export default {
  default: response => response.data,
  loss: ({ data: { data } }) => data.map(d => ({
    ...d,
    bound1: d.tsc_tree_cover_loss_drivers__type,
    year: d.umd_tree_cover_loss__year,
    area: d.umd_tree_cover_loss__ha,
    emissions: d.whrc_aboveground_co2_emissions__Mg,
    biomassLoss: d.whrc_aboveground_biomass_loss__Mg
  }))
}