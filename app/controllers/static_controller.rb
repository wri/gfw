class StaticController < ApplicationController
  before_filter :load_stories

  # skip_before_filter :check_terms, :except => [:data]
  skip_before_filter :check_browser

  respond_to :html
  respond_to :json, :only => :index


  def terms
    @title = 'Terms of Service'
  end

  def about
    @title = 'About'
  end

  def data
    @title = 'Data'
  end

  def howto
    @title = 'How to'
  end

  def keep
    @title = 'Stay informed'

    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @total_stories = Api::Story.visible.count
    @stories_per_page = stories_per_page
    @visible     = Api::Story.find_by_page(@page, stories_per_page)

    respond_with @stories

  end

  def getinvolved
    @title = 'Get Involved'
  end

  def explore
    @title = 'Explore'
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
