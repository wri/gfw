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

    def self.create(params)
      uploads ||= []

      if params['video'].present?
        uploads << {
          url: "",
          embed_url: params['video'],
          preview_url: "",
          mime_type: "",
          order: 1
        }
      end

      params['uploads_ids'].split(',').each_with_index do |id, index|
        uploads << {
          url: id,
          embed_url: "",
          preview_url: id,
          mime_type: "image/jpeg",
          order: params['video'].present? ? index+1 : index
        }
      end

      options = {
                  :email => params['email'],
                  :date => params['date'],
                  :media => uploads,
                  :geom => (if params['the_geom'] != ''
                              JSON.parse(params['the_geom'])
                            else
                              ''
                            end
                           ),
                  :details => params['details'],
                  :location => params['location'],
                  :name => params['name'],
                  :title => params['title']
                }.to_json

      response = post('/stories/new',
                        :body => options,
                        :options => { :headers => { 'Content-Type' => 'application/json' } })

      if response.success?
        response
      else
        nil
      end
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
