class Application
  class << self
    def find_all_countries
      url = "#{ENV['CARTO_API']}/sql?q="
      url += <<-SQL
        SELECT DISTINCT iso, name_engli as name
        FROM gadm36_countries
        WHERE iso != 'XCA' AND iso != 'TWN'
      SQL
      response = Typhoeus.get(URI.encode(url), headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"]
      else
        nil
      end
    end

    def find_adm0_by_adm0_id(adm0)
      return nil unless adm0
      url = "#{ENV['CARTO_API']}/sql?q="
      url += <<-SQL
        SELECT iso, name_engli as name
        FROM gadm36_countries
        WHERE iso = '#{adm0}' AND iso != 'XCA' AND iso != 'TWN'
      SQL
      response = Typhoeus.get(URI.encode(url), headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm1_by_adm0_id(adm0, adm1)
      return nil unless adm1
      url = "#{ENV['CARTO_API']}/sql?q="
      url += <<-SQL
        SELECT iso, gid_1 as id, name_0 as name, name_1 as adm1
        FROM gadm36_adm1
        WHERE gid_1 = '#{adm0}.#{adm1}_1' AND iso != 'XCA' AND iso != 'TWN'
      SQL
      response = Typhoeus.get(URI.encode(url), headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

    def find_adm2_by_adm0_id(adm0, adm1, adm2)
      return nil unless adm2
      url = "#{ENV['CARTO_API']}/sql?q="
      url += <<-SQL
        SELECT gid_2, name_0 as name, name_1 as adm1, name_2 as adm2
        FROM gadm36_adm2
        WHERE gid_2 = '#{adm0}.#{adm1}.#{adm2}_1' AND iso != 'XCA' AND iso != 'TWN' AND type_2 NOT IN ('Waterbody')
      SQL
      response = Typhoeus.get(URI.encode(url), headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        JSON.parse(response.body)["rows"][0]
      else
        nil
      end
    end

  end
end
