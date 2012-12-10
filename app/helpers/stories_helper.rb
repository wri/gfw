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

end
