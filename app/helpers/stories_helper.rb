module StoriesHelper

  def previous_page_link(page)
    page -= 1
    stories_path(:page => page)
  end

  def next_page_link(page)
    page += 1
    stories_path(:page => page)
  end

  def last_page?
    @page == @total_pages
  end

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

  def access_through_token?(story)
    params[:id] == story.token
  end

  def title_or_flash
    return link_to flash[:notice], '#' if flash[:notice].present?

    link_to 'Case Studies', stories_path
  end

  def story_image_or_map(thumbnail_url, coords)
    return thumbnail_url if thumbnail_url.present?

    static_map(coords)
  end

  def static_map(coords)
    "http://maps.google.com/maps/api/staticmap?center=#{coords}&zoom=3&size=266x266&maptype=terrain&sensor=false"
  end

  def show_exclamation?(story)
    link_to "", story, :class => 'exclamation' unless story.featured || story.thumbnail_url.present?
  end

  def error_message_for(story, field)
    content_tag :span, story.errors[field].first, :class => 'error-message'
  end
end
