module Api
  class Story
    include ActiveModel::Model

    attr_accessor :id, :visible, :title, :the_geom, :uploads_ids, :date,
                  :details, :video, :media, :name, :email, :location, :lat,
                  :lng

    validates :title, presence: true
    validates :the_geom, presence: true
    validates :email, presence: true,
                      format: { :with => /@/ }

    def self.visible
      response = Typhoeus.get("http://localhost:8080/stories?bust=1", headers: { "Accept" => "application/json" })

      if response.success?
        JSON.parse(response.body).select { |r| r['visible'] }
      else
        nil
      end
    end

    def create(params)
      if valid?
        uploads = [{
          url: "",
          embed_url: params['video'].present? ? params['video'] : "",
          preview_url: "",
          mime_type: "",
          order: 0
        }]

        uploads_ids = params['uploads_ids'].split(',')

        if uploads_ids.length >= 1
          params['uploads_ids'].split(',').each_with_index do |id, index|
            uploads << {
              url: id,
              embed_url: "",
              preview_url: id,
              mime_type: "image/jpeg",
              order: params['video'].present? ? index+1 : index+2
            }
          end
        end

        options = {
          :email => params['email'],
          :date => params['date'],
          :media => uploads,
          :geom => (params['the_geom'] != '') ? JSON.parse(params['the_geom']) : '',
          :details => params['details'],
          :location => params['location'],
          :name => params['name'],
          :title => params['title']
        }.to_json

        response = Typhoeus.post("#{ENV['GFW_API_HOST']}/stories/new", body: options, headers: { 'Content-Type' => 'application/json' })

        if response.success?
          Story.new(JSON.parse(response.body))
        else
          nil
        end
      end
    end

    def self.find_by_page(page, stories_per_page)
      response = visible.reverse!

      response.shift((page - 1) * stories_per_page)

      response.first(stories_per_page)
    end

    def self.find_by_id_or_token(id)
      response = Typhoeus.get("#{ENV['GFW_API_HOST']}/stories/#{id}", headers: { "Accept" => "application/json" })

      if response.success?
        Story.new(JSON.parse(response.body))
      else
        nil
      end
    end
  end
end
