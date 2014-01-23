module Api
  class Country
    include HTTParty

    base_uri ENV['GFW_API_HOST']

    def self.all
      get('/countries')
    end

    def self.find_by_iso(iso, interval = '12 Months')
      options = { :query => { :iso => iso, :interval => interval } }

      get('/countries', options)
    end
  end
end
