class StoriesController < ApplicationController

  def index
    stories_per_page = 1
    @page            = (params[:page] || 1).to_i
    @total_pages     = Story.where(:featured => true).count / stories_per_page
    @featured        = Story.where(:featured => true).order('cartodb_id ASC').page(@page).per_page(stories_per_page)
    @stories         = if params['for-map'].present?
                         Story.all_for_map
                       else
                         Story.all.sample(5)
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
