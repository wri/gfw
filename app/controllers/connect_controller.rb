class ConnectController < ApplicationController
  layout 'connect'

  def index
    @title = 'My GFW'
    @desc = 'Explore the status of forests worldwide by layering data to create custom maps of forest change, cover, and use.'
    @keywords = 'GFW, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation'
  end

  def contribute
    @title = 'Contribute data'
    @desc = 'Share your data with the GFW community by adding it to the GFW Interactive Map.'
    @keywords = 'GFW, forests, forest data, forest monitoring, forest landscapes, maps, apps, applications, fires, commodities, open landscape partnership, map, palm oil transparency toolkit, forest atlas, develop your own app, climate, biodiversity, deforestation, mobile, explore, browse, tools'
  end
  
end
