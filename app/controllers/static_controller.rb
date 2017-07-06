class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :old
  respond_to :html
  respond_to :json, :only => :keepstories

  LEGACY_SOURCES = YAML.load_file(
    Rails.root.join('config', 'legacy_sources.yml'))

  def terms
    @title = 'Terms of Service'
  end

  def about
    @title = 'About'
    @desc = 'Learn about the ideas and partnerships behind GFW and our outcomes, watch videos, read our data policy, and contact us.'
    @keywords = 'GFW, about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw commodities, about gfw fires'
    @currentNavigation = '.shape-about'
  end

  # TODO: no route?
  def data
    section = params[:section]
    source  = params[:t]
    section = LEGACY_SOURCES[section]
    data_id = section[source] unless section.nil?

    case source
    when 'protected_areas'
      url = 'http://www.protectedplanet.net/'
    when 'palm-oil-mills'
      url = 'http://data.gfw.opendata.arcgis.com/datasets/20398d4dc36e47bd92b559786670f270_0'
    when 'fires'
      url = 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms'
    end

    if data_id.nil?
      url = 'http://data.globalforestwatch.org/'
    else
      url = "http://data.globalforestwatch.org/datasets/#{data_id}"
    end

    redirect_to url
  end

  # TODO: no route?
  def keep
    @title = 'Stay informed'
    @desc = 'Read the latest news and GFW analysis, sign up to receive alerts, and subscribe to areas of interest.'
    @keywords = 'GFW, stay informed, stories, read, news, blog, newsletter, sign up, publications, browse, updates, keep udated, submit, upload, share'
    @currentNavigation = '.shape-keep'

    @page        = (params[:page] || 1).to_i
  end

  # TODO: no route?
  def keepstories
    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @total_stories = Api::Story.visible.count
    @stories_per_page = stories_per_page
    @visible     = Api::Story.find_by_page(@page, stories_per_page)

    respond_with @visible
  end

  # TODO: no route?
  def getinvolved
    @title = 'Get Involved'
    @desc = 'Contribute to the GFW community by providing data, helping improve GFW, developing your own project, or by joining the discussion about GFW.'
    @keywords = 'GFW, help, join, upload, crowdsource, develop, submit, story, app, report, map, public, open, data, share, improve, apply, small grants, fund, feedback, translations, action'
    @currentNavigation = '.shape-getinvolved'
  end

  # TODO: no route?
  def explore
    @title = 'Explore'
    @desc = 'Browse maps and tools available through GFW, create custom visualizations and analyses, access interactive forest statistics, or download data.'
    @keywords = 'GFW, forests, forest data, forest monitoring, forest landscapes, maps, apps, applications, fires, commodities, open landscape partnership, map, palm oil transparency toolkit, forest atlas, develop your own app, climate, biodiversity, deforestation, mobile, explore, browse, tools'
    @currentNavigation = '.shape-all-apps'
  end

  # TODO: no route?
  def feedback
    @title = 'Feedback'

    signup   = params["signup"]
    email    = params["email"]
    feedback = params["feedback"]

    FeedbackMailer.feedback(feedback,signup,email).deliver_now

    if signup == 'true' && email.present?
      Api::Feedback.add_as_tester(email)
    end
  end

  def feedback_jsonp
    signup   = params["signup"]
    email    = params["email"]
    feedback = params["feedback"]
    hostname = params["hostname"]

    FeedbackMailer.feedback(feedback,signup,email,hostname).deliver_now
    if signup == 'true' && email.present?
      Api::Feedback.add_as_tester(email)
    end

    respond_to do |format|
      format.js do
        render :json => true, :callback => params[:callback]
      end
    end
  end

  def contribute
    @title = 'Contribute data'
    @desc = 'Share your data with the GFW community by adding it to the GFW Interactive Map.'
    @keywords = 'GFW, forests, forest data, forest monitoring, forest landscapes, maps, apps, applications, fires, commodities, open landscape partnership, map, palm oil transparency toolkit, forest atlas, develop your own app, climate, biodiversity, deforestation, mobile, explore, browse, tools'
    @s3_direct_post = S3_DATA_BUCKET_NAME.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  end

  def old
    @title = "Oops, your browser isn't supported."
    render layout: 'old_browser'
  end
end
