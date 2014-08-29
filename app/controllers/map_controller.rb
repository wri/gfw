class MapController < ApplicationController
  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  before_filter :validate_url, :only => [:index]

  def index
    @title = 'Map'
  end

  private

    def validate_url
      if (params[:basemap].present? && params[:baselayer].present?)
        baselayers = ['loss', 'forma', 'imazon', 'modis', 'fires', 'none']
        basemaps = ['grayscale', 'terrain', 'satellite', 'roads', 'treeheight']

        for i in 1999..2012
          basemaps.push('landsat'+i.to_s)
        end

        redirect_to map_path unless basemaps.include?(params[:basemap]) && baselayers.include?(params[:baselayer])
      end
    end

end
