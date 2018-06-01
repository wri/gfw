class Dashboards
  class << self
    def find_all_countries
      url = "#{ENV['CARTO_API_URL']}/sql?q=SELECT%20DISTINCT%20iso,%20name_0%20as%20name%20FROM%20gadm28_adm2"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"]
      else
        nil
      end
    end

    def find_country_by_iso(iso)
      return nil unless iso
      url = "#{ENV['CARTO_API_URL']}/sql?q=SELECT%20iso,%20name_0%20as%20name%20FROM%20gadm28_adm2%20WHERE%20iso%20=%20'#{iso}'%20LIMIT%201"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end
  end
end
