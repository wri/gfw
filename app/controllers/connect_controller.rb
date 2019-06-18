class ConnectController < ApplicationController
  layout 'application_old'

  def index
    @title = 'My GFW'
    @desc = 'Create an account or log into My GFW. Explore the status of forests in custom areas by layering data to create custom maps of forest change, cover and use.'
    @keywords = 'GFW, forests, map, forest map, visualization, data, forest data, geospatial, gis, geo, spatial, analysis, local data, global data, forest analysis, explore, layer, terrain, alerts, tree, cover, loss, search, country, deforestation, subscribe'
  end

end
