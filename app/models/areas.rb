class Areas
  class << self

    def find_area_name(adm0)
      return nil unless adm0
      url = "#{ENV['GFW_API']}/v2/area/#{adm0}"
      response = Typhoeus.get(URI.encode(url), headers: {"Accept" => "application/json"})
      if response.success? and (response.body.length > 0)
        geostore = JSON.parse(response.body)["data"]["attributes"]["geostore"]
        responseGeo = Typhoeus.get(URI.encode("#{ENV['GFW_API']}/geodescriber?app=gfw&geostore=#{geostore}"), headers: {"Accept" => "application/json"})
        if responseGeo.success? and (responseGeo.body.length > 0)
          return JSON.parse(responseGeo.body)["data"]
        else
          nil
        end
      else
        nil
      end
    end

  end
end
