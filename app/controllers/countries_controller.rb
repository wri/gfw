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
    @country_iso = params[:id]
  end

  def overview
    @title = 'Country Rankings'
    @desc = 'Compare tree cover change across countries and climate domains and view global rankings.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, deforesters, overview, global'
    @currentNavigation = '.shape-countries'
  end

  def embed_widget
    @country = find_by_iso(params[:id])
    render layout: 'countries_embed'
  end

  private
    def find_countries
      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/countries", headers: {"Accept" => "application/json"})
      if response.success?
        Rails.cache.fetch 'countries', expires_in: 1.day do
          JSON.parse(response.body)['countries']
        end
      else
        nil
      end
    end

    def find_by_iso(iso)
      unless iso.blank?
        iso = iso.downcase
        response = Typhoeus.get(
          "#{ENV['GFW_API_HOST']}/countries/#{iso}?thresh=30",
          headers: {"Accept" => "application/json"}
        )
        if response.success?
          JSON.parse(response.body)
        else
          nil
        end
      end
    end
end
