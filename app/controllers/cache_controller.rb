class CacheController < ApplicationController

  def index
    data = $redis.get(params[:id])
    render :json => { data: data }
  end

  def add
    id = params[:id]
    data = params[:data]
    $redis.set(id, data)

    render :json => { data: data }
  end
  
end