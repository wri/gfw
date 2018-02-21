class Country
  class << self
    def base_path
      ENV['GFW_API_HOST']
    end

    def find_all
      url = "#{base_path}/countries"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success?
        Rails.cache.fetch 'countries', expires_in: 1.day do
          JSON.parse(response.body)['countries']
        end
      else
        nil
      end
    end

    def find_by_iso_or_name(value)
      find_by_iso(value) || find_by_name(value)
    end

    def find_by_iso(iso)
      return nil unless iso
      url = "#{base_path}/countries/#{iso.downcase}?thresh=30"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})

      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)
      else
        nil
      end
    end

    def find_by_name(country_name)
      country_name, *_ = country_name.split(/_/)
      country_name = country_name.capitalize
      url = "https://wri-01.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20gfw2_countries%20where%20name%20like%20'#{country_name}%25'"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})

      if response.success?
        JSON.parse(response.body)['rows'][0]
      else
        nil
      end
    end
  end
end
