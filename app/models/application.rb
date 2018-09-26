class Application
  class << self
    def find_all_countries
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20DISTINCT%20iso,%20name_engli%20as%20name%20FROM%20gadm36_countries%20WHERE%20iso%20!=%20'XCA'%20AND%20iso%20!=%20'TWN'"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"]
      else
        nil
      end
    end

    def find_adm0_by_adm0_id(adm0)
      return nil unless adm0
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20iso%2C%20name_engli%20as%20name%20FROM%20gadm36_countries%20WHERE%20iso%20%3D%20%27#{adm0}%27%20AND%20iso%20!%3D%20%27XCA%27%20AND%20iso%20!%3D%20%27TWN%27"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm1_by_adm0_id(adm0, adm1)
      return nil unless adm1
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20iso%2C%20gid_1%20as%20id%2C%20name_0%20as%20name%2C%20name_1%20as%20adm1%20FROM%20gadm36_adm1%20WHERE%20gid_1%20%3D%20'#{adm0}.#{adm1}_1'%20AND%20iso%20!%3D%20%27XCA%27%20AND%20iso%20!%3D%20%27TWN%27"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm2_by_adm0_id(adm0, adm1, adm2)
      return nil unless adm2
      url = "#{ENV['CARTO_API']}/sql?q=SELECT%20gid_2%2C%20name_0%20as%20name%2C%20name_1%20as%20adm1%2C%20name_2%20as%20adm2%20FROM%20gadm36_adm2%20WHERE%20gid_2%20%3D%20'#{adm0}.#{adm1}.#{adm2}_1'%20AND%20iso%20!%3D%20%27XCA%27%20AND%20iso%20!%3D%20%27TWN%27%20AND%20type_2%20NOT%20IN%20('Waterbody')"
      response = Typhoeus.get(url, headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

  end
end
