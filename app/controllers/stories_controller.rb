class StoriesController < ApplicationController
  layout 'stories'
  helper_method :access_through_token?

  before_filter :load_stories
  before_filter :load_more_stories
  before_filter :load_story, :only => [:show, :edit, :update, :destroy]
  before_filter :check_token, :only => [:edit]

  skip_before_filter :verify_authenticity_token, :only => [:create]

  respond_to :html
  respond_to :json, :only => :index

  def index
    if params['for_map']
      respond_with @stories
      return
    else
      @total_stories_paginated = Api::Story.find_by_page(1, 4)
      @title = 'Crowdsourced Stories'
      return
    end
  end

  def crowdsourcedstories
    stories_per_page = 5

    @page        = (params[:page] || 1).to_i
    @stories_per_page = stories_per_page
    @total_stories = Api::Story.visible.count
    @total_stories_paginated     = Api::Story.find_by_page(@page, stories_per_page)
    
    @title = 'Crowdsourced Stories'
    return
  end

  def show
    @title = @story.title.capitalize
  end

  def new
    @url = stories_path
    @story = Api::Story.new
    @title = 'Submit a story'
    @total_stories_paginated = Api::Story.find_by_page(1, 4)
  end

  def edit
    # @url = story_path(@story.token)
    @method = :put
  end

  def create
    @story = Api::Story.new(params[:story])
    if @story.valid?
      response = @story.create(params[:story])

      # API error
      if response.nil?
        flash[:error] = 'Sorry, there was an error while submitting your story.'
        redirect_to new_story_path
      else
        redirect_to story_path(response.id)
      end
    else
      respond_with @story
    end
  end

  def update
    # TODO
  end

  def destroy
    # TODO
  end

  private

    def load_stories
      @stories = Api::Story.visible
      unless params['for_map'].present? || @stories.blank? || @stories.count < 6
        @stories = @stories.sample(5)
      end
    end
    def load_more_stories
      @more_stories = Api::Story.visible
      unless  @more_stories.blank? || @more_stories.count < 6
        @more_stories = @more_stories.sample(3)
      end
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
