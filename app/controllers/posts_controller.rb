#encoding: UTF-8
class PostsController < ApplicationController
  def show
    if params[:post]=='1'
      render 'post1'
    end
    if params[:post]=='2'
      render 'post2'
    end
    if params[:post]=='3'
      render 'post3'
    end
  end
end
