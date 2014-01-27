module Api
  class Story
    include HTTParty

    base_uri ENV['GFW_API_HOST']

    def self.since(date)
      options = { :query => { :since => date } }

      get('/stories', options)
    end

    def self.featured
      response = get('/stories')

      response.select { |r| r['featured'] }
    end

    def self.find_featured_by_page(page, stories_per_page)
      response = featured

      response.shift((page - 1) * stories_per_page)

      response.first(stories_per_page)
    end

    def self.find_by_id_or_token(id)
      get("/stories/#{id}")
    end
  end
end
