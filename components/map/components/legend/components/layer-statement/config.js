export default {
  lossLayer: {
    // if we want to add this disclaimer (with the hover) to a widget in the legend,
    // - type must be 'lossLayer' in the 'legend' section of the layer, OR
    // - the layer has to have 'isLossLayer=true' in the metadata.
    // For the second case (isLossLayer), type is being overwritten to 'lossLayer'
    // in dataset-provider-actions#L56 (add more special here cases if needed)
    statementPlain: 'Tree cover loss',
    statementHighlight: ' is not always deforestation.',
    tooltipDesc:
      'Tree cover loss is not always deforestation, which typically refers to human-caused, permanent removal of natural forest cover. Tree cover loss is defined as the complete removal of tree cover for any reason. It includes both human-caused loss and natural disturbances, and loss that is permanent or temporary. Examples of tree cover loss that may not meet the definition of deforestation include loss from logging within production forests, fire, disease or storm damage.',
  },
  mosaicLandscapes: {
    statementPlain:
      'Note: This dataset is in draft form and is subject to change.',
    // statementHighlight: 'is not always deforestation.',
    // tooltipDesc:
    //   'Loss of tree cover may occur for many reasons, including deforestation, fire, and logging within the course of sustainable forestry operations. In sustainably managed forests, the “loss” will eventually show up as “gain”, as young trees get large enough to achieve canopy closure.',
  },
  isoLayer: {
    statementPlain: 'This layer is only available for ',
    statementHighlight: 'certain countries.',
  },
  landmarkLayer: {
    statementPlain:
      'Note that the absence of data does not indicate the absence of Indigenous or Community land.',
  },
  kbaLayer: {
    statementPlain: 'non-commercial use only',
  },
  lossDriverLayer: {
    statementHighlight: 'Hover for details on drivers classes.',
    tooltipDesc: `Permanent agriculture: Long-term, permanent tree cover loss for small- to large-scale agriculture. \n
      Hard commodities: Loss due to the establishment or expansion of mining or energy infrastructure.\n
      Shifting cultivation: Tree cover loss due to small- to medium-scale clearing for temporary cultivation that is later abandoned and followed by subsequent regrowth of secondary forest or vegetation.\n
      Logging: Forest management and logging activities occurring within managed, natural or semi-natural forests and plantations, often with evidence of forest regrowth or planting in subsequent years.\n
      Settlements and infrastructure: Tree cover loss due to expansion and intensification of roads, settlements, urban areas, or built infrastructure (not associated with other classes).\n
      Other natural disturbances: Tree cover loss due to other non-fire natural disturbances (e.g., landslides, insect outbreaks, river meandering).`,
  },
};
