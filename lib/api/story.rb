module Api
  class Story
    include HTTParty

    base_uri ENV['GFW_API_HOST']

    # format :json
    # attr_accessor :details, :email, :featured, :name,
    #               :title, :visible, :date, :location,
    #               :id, :coordinates, :media, :the_geom,
    #               :when_did_it_happen, :where_did_it_happen

    # def initialize(details, email, featured, name,
    #                title, visible, date, location,
    #                id, coordinates, media, the_geom,
    #                when_did_it_happen, where_did_it_happen)
    #   self.details = details
    #   self.email = email
    #   self.featured = featured
    #   self.name = name
    #   self.title = title
    #   self.visible = visible
    #   self.date = date
    #   self.location = location
    #   self.id = id
    #   self.coordinates = coordinates
    #   self.media = media
    #   self.the_geom = the_geom
    #   self.when_did_it_happen = when_did_it_happen
    #   self.where_did_it_happen = where_did_it_happen
    # end

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
      response = get("/stories/#{id}")

      # json = JSON.parse(response.body, symbolize_names: true)

      # self.new(
      #   json[:details], json[:email], json[:featured], json[:name],
      #   json[:title], json[:visible], json[:date], json[:location],
      #   json[:id], json[:coordinates], json[:media], json[:the_geom],
      #   json[:when_did_it_happen], json[:where_did_it_happen])
    end
  end
end
