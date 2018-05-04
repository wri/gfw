class CacheController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    data = $redis.get(params[:id])
    if data
      data = JSON.parse(data)
    end

    render :json => { data: data }
  end

  def add
    id = params[:id]
    data = params[:data].to_json
    $redis.set(id, data)

    render :json => { id: id, data: data }
  end

  def keys
    data = $redis.keys('*')
    render :json => { data: data }
  end
  
end