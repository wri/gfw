module StoriesHelper

  def previous_page_link(page)
    page -= 1
    stories_path(:page => page)
  end

  def next_page_link(page)
    page += 1
    stories_path(:page => page)
  end

  def previous_page_keep(page)
    page -= 1
    return "/keepupdated/crowdsourced-stories?page=#{page}"
  end

  def next_page_keep(page)
    page += 1
    return "/keepupdated/crowdsourced-stories?page=#{page}"
  end

  def last_page?
    @page == @total_pages
  end

  def story_image_or_map(media, coords = nil)
    return "#{ENV['AWS_HOST']}/#{media[1]['preview_url']}" if media[1].present?
    unless coords.nil?
      static_map(coords)
    end
  end

  def static_map(coords, size="266x266", zoom="3", stories=false)
    marker = stories ? "&markers=icon:#{ENV['AWS_HOST']}/marker_exclamation.png%7C#{coords.to_s.gsub(" ", "")}" : ""

    "http://maps.google.com/maps/api/staticmap?center=#{coords.to_s.gsub(" ", "")}&zoom=#{zoom}&size=#{size}#{marker}&maptype=terrain&sensor=false"
  end

  def youtube_embed(youtube_url)
    if youtube_url[/youtu\.be\/([^\?]*)/]
      youtube_id = $1
    else
      # Regex from # http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url/4811367#4811367
      youtube_url[/^.*((v\/)|(embed\/)|(watch\?))\??v?=?([^\&\?]*).*/]
      youtube_id = $5
    end

    %Q(<iframe width="483" height="362" src="//www.youtube.com/embed/#{youtube_id}" frameborder="0" allowfullscreen></iframe>)
  end

end
