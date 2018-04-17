class CountriesController < ApplicationController
  before_action :set_country, only: :show

  include ActionView::Helpers::NumberHelper

  layout 'countries'

  def index
    @countries = Country.find_all
    @title = 'Country Profiles'
    @desc = 'Explore country-specific statistics and graphs to see the how forests change and contribute to various sectors.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, overview'
    @currentNavigation = '.shape-countries'
  end

  def show
    if @country['gva'].present? && @country['gva'] > 0
      gva_precision = (@country['gva_percent'] < 0.1) ? 2 : 1
      @country['gva_percent'] = number_to_percentage(@country['gva_percent'], precision: gva_precision)
    end

    @employees = @country['employment']
    @conventions = %w(cbd unfccc kyoto unccd itta cites ramsar world_heritage nlbi ilo)

    blog_story = Api::Blog.find_by_country(@country)
    @blog_story = blog_story.present? ? blog_story : nil

    response = Typhoeus.get("https://wri-01.carto.com/api/v2/sql?q=with%20r%20as%20((select%20the_geom_webmercator%20from%0Agadm2_countries%20where%20iso%3Dupper('#{@country['iso'].downcase}')))%20SELECT%20f.the_geom%2C%20author%2C%20date%2C%20image%2C%20lat%2Clon%2Ctitle%20FROM%20mongabay%20f%2C%20r%20WHERE%20st_intersects(f.the_geom_webmercator%2Cr.the_geom_webmercator)%20order%20by%20date%3A%3Adate%20desc", headers: { "Accept" => "application/json" })
    @mongabay_story = if response.success?
                        JSON.parse(response.body)['rows'][0]
                      else
                        nil
                      end
    @title = @country['name']
    @desc = 'Data about forest change, tenure, forest related employment and land use in ' + @title
    @currentNavigation = '.shape-countries'
  end

  def overview
    @title = 'Country Rankings'
    @desc = 'Compare tree cover change across countries and climate domains and view global rankings.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, deforesters, overview, global'
    @currentNavigation = '.shape-countries'
  end

  private

    def set_country
      @country = Country.find_by_iso_or_name(params[:id])
    end
end
