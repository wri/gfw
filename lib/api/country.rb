module Api
  class Country
    def self.all
      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/countries", headers: {"Accept" => "application/json"})

      if response.success?
        JSON.parse(response.body)
      else
        nil
      end
    end

    def self.find_by_iso(iso)
      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/countries", params: { iso: iso }, headers: {"Accept" => "application/json"})

      if response.success?
        JSON.parse(response.body)
      else
        nil
      end
    end
  end
end
