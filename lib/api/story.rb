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
      response = Typhoeus.get("#{ENV['GFW_API_OLD']}/stories?bust=1", headers: { "Accept" => "application/json" })

      if response.success?
        JSON.parse(response.body).select { |r| r['visible'] }
      else
        nil
      end
    end

    def create(params)
      if valid?
        uploads = []
        uploads_ids = params['uploads_ids'].split(',')
        if uploads_ids.length >= 1
          uploads_ids.each_with_index do |id, index|
            idSub_video = id.sub('VID-','')
            uploads << {
              url: (id.start_with?('VID-'))? idSub_video : id,
              embed_url: (id.start_with?('VID-'))? "https://www.youtube.com/watch?v=" + idSub_video.sub('http://img.youtube.com/vi/','').sub('/default.jpg','') : "",
              preview_url: id,
              mime_type: (id.start_with?('VID-'))? "" : "image/jpeg",
              order: index
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

        response = Typhoeus.post("#{ENV['GFW_API_OLD']}/stories/new", body: options, headers: { 'Content-Type' => 'application/json' })

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
      response = Typhoeus.get("#{ENV['GFW_API_OLD']}/stories/#{id}", headers: { "Accept" => "application/json" })

      if response.success?
        Story.new(JSON.parse(response.body))
      else
        nil
      end
    end
  end
end
