class StoriesController < ApplicationController
  helper_method :access_through_token?

  before_filter :load_stories
  before_filter :load_story, :only => [:show, :edit, :update, :destroy]
  before_filter :check_token, :only => [:edit]

  skip_before_filter :verify_authenticity_token, :only => [:create]

  respond_to :html
  respond_to :json, :only => :index

  def index
    stories_per_page = 5

    unless params['for_map']
      @page        = (params[:page] || 1).to_i
      @total_pages = (Api::Story.visible.count.to_f / stories_per_page.to_f).ceil
      @visible     = Api::Story.find_by_page(@page, stories_per_page)
    end

    respond_with @stories
  end

  def new
    @url = stories_path
    @story = Api::Story.new
  end

  def edit
    # @url = story_path(@story.token)
    @method = :put
  end

  def create
    @story = Api::Story.new(params[:story])

    if @story.valid?
      response = @story.create(params[:story])

      redirect_to story_path(response.id)
    else
      respond_with @story
    end
  end

  def update

  end

  def destroy

  end

  private

    def load_stories
      @stories = if params['for_map'].present?
                   Api::Story.visible
                 else
                   Api::Story.visible.sample(5)
                 end
    end

    def access_through_token?(story)
      # params[:id] === story.token
      false
    end

    def check_token
      redirect_to(story_path(@story), :notice => "You don't have permissions to edit this story.") unless access_through_token?(@story)
    end

    def load_story
      story = Api::Story.find_by_id_or_token(params[:id])

      not_found unless story.present?

      @story = story
    end

end
