class StoriesController < ApplicationController
  before_filter :get_story, :only => [:show, :edit, :update, :destroy]

  def index
    stories_per_page = 3
    @page            = (params[:page] || 1).to_i
    @total_pages     = (Story.select('count(cartodb_id) as count').where(:featured => true).first.attributes[:count].to_f / stories_per_page.to_f).ceil
    @featured        = Story.featured(@page, stories_per_page)
    @stories         = if params['for-map'].present?
                         Story.all_for_map
                       else
                         Story.random(5)
                       end

    respond_to do |format|
      format.json { render :json => @stories } if params['for-map']
      format.html
    end
  end

  def show
    @stories = Story.random(5)
  end

  def new
    @story     = Story.new({})
    @url       = stories_path
    @media_url = media_path
  end

  def edit
    @url       = story_path(@story.token)
    @method    = :put
    @media_url = media_path
  end

  def create
    @story = Story.new(params[:story])

    if @story.valid?
      @story.save

      flash[:notice] = 'Your story has been registered. Thanks!'

      Notifications.new_story(@story).deliver

      redirect_to story_path(@story)
    else
      render :new
    end

  end

  def update

    @story = @story.update_attributes(params[:story])

    if @story.valid?
      @story.save

      flash[:notice] = 'Your story has been updated. Thanks!'

      redirect_to story_path(@story)
    else
      render :edit
    end
  end

  def destroy
    @story.destroy

    flash[:notice] = 'Your story has been deleted. Thanks!'

    redirect_to stories_path
  end

  def get_story
    @story = Story.select(Story::SELECT_FIELDS).where("cartodb_id = ?", params[:id]).first
    @story ||= Story.select(Story::SELECT_FIELDS).where("token = '?'", params[:id]).first
  end
end
