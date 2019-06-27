class SearchController < ApplicationController
  layout 'application_old'

  # GET /search/:query/:page
  def index
    @title = "Search"
    @desc = 'Search forest information, including forest data, news, updates and more.'
    @keywords = 'GFW, forests, forest data, data, forest news, forest alerts, conservation, forest updates, forest watch, deforestation, deforesting, tree cover loss, forest loss'
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
      query = _query
      page = _page ? 1+((_page.to_i-1)*10) : 1
      response = Typhoeus.get("https://www.googleapis.com/customsearch/v1?",
                              params: { key: ENV['GOOGLE_SEARCH_API_KEY'],
                                        cx: ENV['GOOGLE_CUSTOM_SEARCH_CX'], q: query,
                                        start: page, filter: 0},
                                        headers: {"Accept" => "application/json"})
      if response.success?
        JSON.parse(response.body)
      else
        nil
      end
    end
end
