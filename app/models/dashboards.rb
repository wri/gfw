class Dashboards
  class << self
    def find_all_countries
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20DISTINCT%20iso,%20name_engli%20as%20name%20FROM%20gadm28_countries%20WHERE%20iso%20!=%20'XCA'%20AND%20iso%20!=%20'TWN'"
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
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20iso,%20name_engli%20as%20name%20FROM%20gadm28_countries%20WHERE%20iso%20=%20'#{iso}'%20AND%20iso%20!=%20'XCA'%20AND%20iso%20!=%20'TWN'%20LIMIT%201"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm1_by_iso_id(iso, adm1)
      return nil unless adm1
      url = "#{ENV['CARTO_API_URL']}/sql?q=SELECT%20iso%2C%20id_1%20as%20id%2C%20name_0%20as%20name%2C%20name_1%20as%20adm1%20FROM%20gadm28_adm1%20WHERE%20iso%20%3D%20%27#{iso}%27%20AND%20id_1%20%3D%20#{adm1}"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm2_by_iso_id(iso, adm1, adm2)
      return nil if check_adm2_waterbody(iso, adm1)
      url = "#{ENV['CARTO_API_URL']}/sql?q=SELECT%20iso%2C%20id_1%2C%20id_2%2C%20name_0%20as%20name%2C%20name_1%20as%20adm1%2C%20name_2%20as%20adm2%20FROM%20gadm28_adm2%20WHERE%20iso%20%3D%20%27#{iso}%27%20AND%20id_1%20%3D%20#{adm1}%20AND%20id_2%20%3D%20#{adm2}"
      # CACHE: &bust=true if you want to flush the cache
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def check_adm2_waterbody(iso, adm1)
      return nil unless adm1
      url = "#{ENV['CARTO_API_URL']}/sql?q=SELECT%20iso%2C%20adm1%2C%20adm2%20FROM%20water_bodies_gadm28%20WHERE%20iso%20%3D%20%27#{iso}%27%20AND%20adm1%20%3D%20#{adm1}"
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
