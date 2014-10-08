class SearchController < ApplicationController

  # GET /search/:query/:page
  def index
    @title = "Search"
    if params[:query]
      result = search_by(params[:query],params[:page])
      @query = params[:query]
      @result = result 

      # links
      if @result['queries']['nextPage']
        request = @result['queries']['nextPage'][0]['searchTerms']
        page = (@result['queries']['nextPage'][0]['startIndex'].to_i/10).floor + 1
        @nextlink = '/search/'+ request +'/'+ page.to_s
      end
      if @result['queries']['previousPage']
        request = @result['queries']['previousPage'][0]['searchTerms']
        page = (@result['queries']['previousPage'][0]['startIndex'].to_i/10).floor + 1
        @prevlink = '/search/'+ request +'/'+ page.to_s
      end

      #info
      @info = {}
      @info['totalView'] = @result['queries']['request'][0]['totalResults'].to_i
      @info['startView'] = @result['queries']['request'][0]['startIndex'].to_i
      @info['endView'] = @result['queries']['request'][0]['startIndex'].to_i + @result['queries']['request'][0]['count'] - 1


    end
  end

  private
    def search_by(_query,_page)
      apiKey = "AIzaSyCMGfdDaSfjqv5zYoS0mTJnOT3e9MURWkU"
      cx = "006990932653323112931:qxwxtwbu7vg"
      query = _query
      page = _page ? 1+((_page.to_i-1)*10) : 1
      response = Typhoeus.get("https://www.googleapis.com/customsearch/v1?", params: { key: apiKey , cx: cx, q: query , start: page, filter: 0}, headers: {"Accept" => "application/json"})
      puts response

      if response.success?
          JSON.parse(response.body)
      else
        nil
      end
    end
end
