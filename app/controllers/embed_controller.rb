class EmbedController < ApplicationController
  layout 'embed'

  # GET /embed/country/:id
  def countries_show
    country = find_by_iso(params[:id])

    not_found unless country.present?

    @country = country
  end

  def countries_show_info
    country = find_by_iso(params[:id])

    not_found unless country.present?

    @country = country
    @employees = @country['employment']
  end

  private
    def find_by_iso(iso)
      iso = iso.downcase

      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/countries", params: { iso: iso }, headers: {"Accept" => "application/json"})

      if response.success?
        Rails.cache.fetch 'country_' + iso, expires_in: 1.day do
          JSON.parse(response.body)['countries'][0]
        end
      else
        nil
      end
    end
end
