class StoriesController < ApplicationController
  layout 'stories'

  respond_to :html

  def index
    redirect_to '/stayinformed/crowdsourced-stories'
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
    #@title = @story.title.capitalize
  end

  def new
    @title = I18n.translate 'stories.new.title'
  end
end
