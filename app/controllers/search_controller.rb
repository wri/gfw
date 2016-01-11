class SearchController < ApplicationController

  # GET /search/:query/:page
  def index
    @title = "Search"
    if params[:query]
      result = search_by(params[:query],params[:page])
      @result = result
      @query = params[:query]
      @page = params[:page]
      @total = @result['queries']['request'][0]['totalResults'].to_i

    end
  end

  private
    def search_by(_query,_page)
      apiKey = "AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU"
      cx = "006990932653323112931:qxwxtwbu7vg"
      query = _query
      page = _page ? 1+((_page.to_i-1)*10) : 1
      response = Typhoeus.get("https://www.googleapis.com/customsearch/v1?", params: { key: apiKey , cx: cx, q: query , start: page, filter: 0}, headers: {"Accept" => "application/json"})

      if response.success?
          JSON.parse(response.body)
      else
        nil
      end
    end
end
