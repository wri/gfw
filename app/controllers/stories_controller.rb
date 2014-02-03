class StoriesController < ApplicationController

  helper_method :access_through_token?

  before_filter :load_stories
  before_filter :load_story, :only => [:show, :edit, :update, :destroy]
  before_filter :check_token, :only => [:edit]

  skip_before_filter :verify_authenticity_token, :only => [:create]

  def index
    stories_per_page = 5

    unless params['for_map']
      @page         = (params[:page] || 1).to_i
      @total_pages  = (Api::Story.featured.count.to_f / stories_per_page.to_f).ceil
      @featured     = Api::Story.find_featured_by_page(@page, stories_per_page)
    end

    respond_to do |format|
      format.json { render :json => @stories } if params['for_map']
      format.html
    end
  end

  def new
    @url = stories_path
  end

  def edit
    # @url = story_path(@story.token)
    @url = story_path(@story)
    @method = :put
  end

  def create
    Api::Story.create(params)

    flash[:notice] = 'Your story has been registered. Thanks!'

    # redirect_to story_path(@story)
    redirect_to story_path(1)
  end

  def update

  end

  def destroy

  end

  private

    def load_stories
      @stories = if params['for_map'].present?
                   Api::Story.featured
                 else
                   Api::Story.featured.sample(5)
                 end
    end

    def access_through_token?(story)
      # params[:id] === story.token
      true
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
