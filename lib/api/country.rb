module Api
  class Country
    include HTTParty

    base_uri ENV['GFW_API_HOST']

    def self.all
      get('/countries')
    end

    def self.find_by_iso(iso)
      options = { :query => { :iso => iso } }

      get('/countries', options)
    end
  end
end
