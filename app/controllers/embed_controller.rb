class EmbedController < ApplicationController
  before_action :check_country_iso
  layout 'embed'

  # GET /embed/country/:id
  def countries_show
  end

  def countries_show_info
    @employees = @country['employment']
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
            "#{ENV['GFW_API_HOST']}/countries/#{iso}",
            headers: {"Accept" => "application/json"}
        )
        if response.success?
          JSON.parse(response.body)
        else
          nil
        end
      end
    end
    def find_by_name(country_name)
      country_name, *rest = country_name.split(/_/)
      country_name = country_name.capitalize!
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
