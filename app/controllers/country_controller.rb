class CountryController < ApplicationController
  before_action :check_country_iso, only: :index

  include ActionView::Helpers::NumberHelper

  layout 'country'

  def index
    if @country['gva'].present? && @country['gva'] > 0
      gva_precision = (@country['gva_percent'] < 0.1) ? 2 : 1
      @country['gva_percent'] = number_to_percentage(@country['gva_percent'], precision: gva_precision)
    end

    @employees = @country['employment']
    @conventions = %w(cbd unfccc kyoto unccd itta cites ramsar world_heritage nlbi ilo)

    blog_story = Api::Blog.find_by_country(@country)
    @blog_story = blog_story.present? ? blog_story : nil

    response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=with%20r%20as%20((select%20the_geom_webmercator%20from%0Agadm2_countries%20where%20iso%3Dupper('#{@country['iso'].downcase}')))%20SELECT%20f.the_geom%2C%20author%2C%20date%2C%20image%2C%20lat%2Clon%2Ctitle%20FROM%20mongabay%20f%2C%20r%20WHERE%20st_intersects(f.the_geom_webmercator%2Cr.the_geom_webmercator)%20order%20by%20date%3A%3Adate%20desc", headers: { "Accept" => "application/json" })
    @mongabay_story = if response.success?
                        JSON.parse(response.body)['rows'][0]
                      else
                        nil
                      end
    @title = @country['name']
    @desc = 'Data about forest change, tenure, forest related employment and land use in ' + @title
  end

  def overview
    @title = 'Country Rankings'
    @desc = 'Compare tree cover change across countries and climate domains and view global rankings.'
    @keywords = 'GFW, list, forest data, visualization, data, national, country, analysis, statistic, tree cover loss, tree cover gain, climate domain, boreal, tropical, subtropical, temperate, deforestation, deforesters, overview, global'
    @currentNavigation = '.shape-countries'
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
      # CACHE: &bust=true if you want to flush the cache
      iso = iso.downcase
      response = Typhoeus.get(
        "#{ENV['GFW_API_HOST']}/countries/#{iso}?thresh=30",
        headers: {"Accept" => "application/json"}
      )
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)
      else
        nil
      end
    end
  end

  def find_by_name(country_name)
    country_name, *_ = country_name.split(/_/)
    country_name = country_name.capitalize
    response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20gfw2_countries%20where%20name%20like%20'#{country_name}%25'",
                            headers: {"Accept" => "application/json"}
    )
    if response.success?
      JSON.parse(response.body)['rows'][0]
    else
      nil
    end
  end

  def check_country_iso
    @country = find_by_iso(params[:id])
    unless @country.nil?
      @country
    else
      @country = find_by_name(params[:id])
    end
    @country
  end
end
