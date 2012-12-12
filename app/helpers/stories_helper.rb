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

    coords = [story.the_geom.y, story.the_geom.x]
    coords.map{|coord| number_with_precision(coord, :precision => 2)}.join(', ')
  end
end
