class CountriesController < ApplicationController
  include ActionView::Helpers::NumberHelper

  layout 'countries'

  def index
    @countries = find_countries
    @title = 'Country Profiles'
    @desc = 'Explore country-specific statistics and graphs to see the how forests change and contribute to various sectors.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, overview'
    @currentNavigation = '.shape-countries'
  end

  def show
    @currentNavigation = '.shape-countries'
  end

  def overview
    @title = 'Country Rankings'
    @desc = 'Compare tree cover change across countries and climate domains and view global rankings.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, deforesters, overview, global'
    @currentNavigation = '.shape-countries'
  end
end
