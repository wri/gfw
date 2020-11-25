export default {
  loss: {
    sum: ['area__ha'],
    groupBy: ['umd_tree_cover_loss__year'],
    filters: ['umd_tree_cover_density_{extentYear}__{threshold}'],
  },
  extent: {
    sum: ['area__ha'],
    filters: ['umd_tree_cover_density_{extentYear}__{threshold}']
  }
}
