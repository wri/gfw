class StoriesController < ApplicationController

  def index
    @page     = params[:page] || 1
    @featured = Story.where(:featured => true).order('cartodb_id ASC')
    @stories  = Story.all.first(4)
  end

  def show
    @story   = Story.where("token = '?'", params[:id]).first
    @stories  = Story.all.first(4)
  end

  def new
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

      Notifications.new_story(@story).deliver

      redirect_to story_path(@story)
    else
      render :new
    end

  end

end
