class CacheController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    data = $redis.get(params[:id]) if Rails.env.production?
    if data
      data = JSON.parse(data)
    end

    render :json => data
  end

  def add
    if Rails.env.production?
      id = params[:id]
      data = params[:data].to_json
      expire = params[:expire] || 86400
      $redis.set(id, data, ex: expire)

      render :json => { id: id, data: data, expire: expire }
    else
      render :json => { }
    end
  end

  def keys
    data = $redis.keys('*') if Rails.env.production?
    render :json => { data: data }
  end

end
