class Dashboards
  class << self
    def base_path
      "#{ENV['CARTO_API_URL']}/sql?q="
    end

    def find_by_iso_or_name(value)
      find_by_iso(value) || find_by_name(value)
    end

    def find_by_iso(iso)
      return nil unless iso
      url = "#{base_path}SELECT%20iso,%20name_0%20as%20name%20FROM%20gadm28_adm2%20WHERE%20iso%20=%20'#{iso}'%20LIMIT%201"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_by_name(country_name)
      country_name, *_ = country_name.split(/_/)
      country_name = country_name.capitalize
      url = "#{base_path}SELECT iso, name_0 as name FROM gadm28_adm2 WHERE name like '#{country_name}' LIMIT 1"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})

      if response.success?
        JSON.parse(response.body)['rows'][0]
      else
        nil
      end
    end
  end
end
