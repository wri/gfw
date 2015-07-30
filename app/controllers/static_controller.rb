class StaticController < ApplicationController
  skip_before_action :check_browser, :only => :old
  #before_filter :load_stories
  skip_before_filter :check_terms, :except => [:data]
  respond_to :html
  respond_to :json, :only => :keepstories


  def terms
    @title = 'Terms of Service'
  end

  def about
    @title = 'About'
    @desc = 'Learn about the ideas and partnerships behind GFW and our outcomes, watch videos, read our data policy, and contact us.'
    @keywords = 'about, global forest watch, about gfw, history, staff, world resources institute, wri, about gfw commodities, about gfw fires'
  end

  def data
    @title = 'Download Data'
    @desc = 'Browse and download forest-related data directly through the GFW Open Data Portal.'
    @keywords = 'open data portal, data, sets, browse, download, map, satellite, search data, explore data, forest change, forest cover, conservation, people, forest use, deforestation, land use, landscapes'
  end

  def howto
    @title = 'How To'
    @desc = 'Learn to use the GFW platform with detailed directions on how to harness a wide variety of content and capabilities to suit your interests.'
    @keywords = 'how to, howto, learn to, instuctions, video, tutorial, tutorials, guidelines, guide, learn, help, platform, website, map, analyze, manual, faqs'
  end

  def keep
    @title = 'Stay informed'
    @desc = 'Read the latest news and GFW analysis, sign up to receive alerts, and subscribe to areas of interest.'
    @keywords = 'stay informed, stories, read, news, blog, newsletter, sign up, publications, browse, updates, keep udated, submit, upload, share'

    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @total_stories = Api::Story.visible.count
    @stories_per_page = stories_per_page
    @visible     = Api::Story.find_by_page(@page, stories_per_page)

    respond_with @stories

  end

  def keepstories
    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @total_stories = Api::Story.visible.count
    @stories_per_page = stories_per_page
    @visible     = Api::Story.find_by_page(@page, stories_per_page)

    respond_with @visible

  end

  def getinvolved
    @title = 'Get Involved'
    @desc = 'Contribute to the GFW community by providing data, helping improve GFW, developing your own project, or by joining the discussion about GFW.'
    @keywords = 'help, join, upload, crowdsource, develop, submit, story, app, report, map, public, open, data, share, improve, apply, small grants, fund, feedback, translations, action'
  end

  def explore
    @title = 'Explore'
    @desc = 'Browse maps and tools available through GFW, create custom visualizations and analyses, access interactive forest statistics, or download data.'
    @keywords = 'forests, forest data, forest monitoring, forest landscapes, maps, apps, applications, fires, commodities, open landscape partnership, map, palm oil transparency toolkit, forest atlas, develop your own app, climate, biodiversity, deforestation, mobile, explore, browse, tools'
  end

  def feedback
    @title = 'Feedback'

    signup   = params["signup"]
    email    = params["email"]
    feedback = params["feedback"]
    YourMailer.feedback(feedback,signup,email).deliver
  end

  def old
    @title = "Oops, your browser isn't supported."
    render layout: 'old_browser'
  end

  private

    def load_stories
      @stories = Api::Story.visible.sample(5)
    end

    def access_through_token?(story)
      # params[:id] === story.token
      false
    end

    def check_token
      unless access_through_token?(@story)
        flash[:notice] = "You don't have permissions to edit this story."
        redirect_to story_path(@story)
      end
    end

    def load_story
      story = Api::Story.find_by_id_or_token(params[:id])

      not_found unless story.present?

      @story = story
    end

end
