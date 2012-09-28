module StoriesHelper

  def render_media(media)
    if media.video?
      raw media.embed_html
    else
      image_tag media.url
    end
  end

end
