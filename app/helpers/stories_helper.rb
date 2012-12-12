module StoriesHelper

  def render_media(media)
    if media.video?
      raw media.embed_html
    else
      image_tag media.url
    end
  end

  def story_submit_button(form, story)
    if story.present?
      content_tag :div do
        raw [
          form.submit('Submit story'),
          content_tag(:span, ' or '),
          link_to('cancel', story_path(story))
        ].join
      end
    else
      content_tag :div do
        form.submit('Submit story')
      end
    end
  end

  def last_page?
    false
  end

  def access_through_token?(story)
    params[:id] == story.token
  end

  def title_or_flash
    return link_to flash[:notice], '#' if flash[:notice].present?

    link_to 'Case Studies', stories_path
  end

  def coords(story)
    return '' if story.the_geom.blank?

    coords = [story.the_geom.centroid.y, story.the_geom.centroid.x] if     story.the_geom.respond_to?(:centroid)
    coords = [story.the_geom.y, story.the_geom.x]                   unless story.the_geom.respond_to?(:centroid)

    coords.map{|coord| number_with_precision(coord, :precision => 2)}.join(', ')
  end

  def story_image_or_map(story)
    image = story.main_thumbnail.try(:thumbnail_url)
    return image if image.present?

    static_map(story)
  end

  def static_map(story)
    static_map_url = lambda{|lat_lon| "http://maps.google.com/maps/api/staticmap?center=#{lat_lon}&zoom=3&size=266x266&maptype=satellite&sensor=false" }
    static_map_url.call(coords(story))
  end

  def show_exclamation?(story)
    content_tag :div, nil, :class => 'exclamation' unless story.featured || story.main_thumbnail.try(:thumbnail_url).present?
  end

  def error_message_for(story, field)
    content_tag :span, story.errors[field].first, :class => 'error-message'
  end
end
