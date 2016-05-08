class LandingController < ApplicationController
  layout 'landing'
  def is_number?(string)
    true if Float(string) rescue false
  end

  def index
    require 'open-uri'
    @title = 'Monitoring forests in near real time'
    @desc = 'Empowering people everywhere to better manage and conserve forest landscapes through an interactive online forest monitoring system.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, gis, visualize, geospatial, forest analysis, forest news, forest alerts, conservation, forest updates, forest watch, analysis, deforestation, deforesting, tree cover loss, explore forests, mapping, trees, forest loss'
    @feedview    = []
    @storiesview = []
    @currentNavigation = '.shape-home'
  end

end
