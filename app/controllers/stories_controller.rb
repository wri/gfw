class StoriesController < ApplicationController

  def index
    @page     = params[:page] || 1
    @featured = Story.where(:featured => true).order('cartodb_id ASC')
    @stories  = if params['for-map'].present?
                  Story.all_for_map
                else
                  Story.all.first(4)
                end

    respond_to do |format|
      format.json { render :json => @stories } if params['for-map']
      format.html
    end
  end

  def show
    @story   = Story.where("cartodb_id = ?", params[:id]).first
    @story   = @story || Story.where("token = '?'", params[:id]).first
    @stories = Story.all.first(4)
  end

  def new
    @story     = Story.new({})
    @url       = stories_path
    @media_url = media_path
  end

  def edit
    @story     = Story.where("token = '?'", params[:id]).first
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

end
