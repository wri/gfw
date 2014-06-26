class CountriesController < ApplicationController

  def index
    @countries = find_countries
  end

  # GET /country/:id
  def show
    country = find_by_iso(params[:id])

    not_found unless country.present?

    blog_story = Api::Blog.find_by_country(country)
    @blog_story = blog_story.present? ? blog_story : nil

    response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20mongabaydb%20WHERE%20position('#{I18n.transliterate(country['name']).downcase.gsub(" ", "_")}'%20in%20keywords)%20%3C%3E%200", headers: { "Accept" => "application/json" })
    @mongabay_story = response.success? ? JSON.parse(response.body)['rows'][0] : nil

    @country = country
  end

  private
    def find_countries
      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/countries", headers: {"Accept" => "application/json"})
      if response.success?
        JSON.parse(response.body)['countries']
      else
        nil
      end
    end

    def find_by_iso(iso)
      response = Typhoeus.get(
          "#{ENV['GFW_API_HOST']}/countries",
          headers: {"Accept" => "application/json"},
          params: {iso: iso}
      )
      if response.success?
        JSON.parse(response.body)['countries'][0]
      else
        nil
      end
    end

end
