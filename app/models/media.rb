class Media < CartoDB::Model::Base
  include ActiveModel::Validations

  field :story_id
  field :image
  field :video_url
  field :embed_html
  field :image_url
  field :thumbnail_url

  def to_param
    cartodb_id.to_s
  end

  def video_url=(video_url)
    oembed_json = JSON.parse(open(oembed_url(video_url)).read) rescue {}
    self.embed_html = oembed_json['html']
  end

  def oembed_url(video_url)
    if youtube_video?(video_url)
      "http://www.youtube.com/oembed?url=#{video_url}&format=json&maxwidth=608"
    else
      "http://vimeo.com/api/oembed.json?url=#{video_url}&maxwidth=608"
    end
  end

  def video?
    self.embed_html.present?
  end

  def youtube_video?(video_url)
    video_url.match(/youtu\.be|youtube.com/)
  end
end
