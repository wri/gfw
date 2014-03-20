class HomeController < ApplicationController
  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  before_filter :validate_url, :only => [:index]
  before_filter :load_circles, :only => [:index]

  def index
    @visible = Api::Story.visible.first(3)
  end

  def accept_and_redirect
    cookies.permanent[ENV['TERMS_COOKIE'].to_sym] = { :value => true, :domain => ENV['GFW_HOST'] }

    if cookies[:go_to_from_blog].present?
      redirect = cookies[:go_to_from_blog]
    else
      if cookies[:go_to].nil?
        redirect = root_path
      elsif cookies[:go_to] == root_path
        redirect = map_path
      else
        redirect = cookies[:go_to]
      end
    end

    redirect_to redirect
  end

  private

    def validate_url
      if (params[:basemap].present? && params[:baselayer].present?)
        baselayers = ['loss', 'forma', 'imazon', 'modis', 'none']
        basemaps = ['grayscale', 'terrain', 'satellite', 'roads', 'treeheight']

        for i in 1999..2012
          baselayers.push('landsat'+i.to_s)
        end

        redirect_to map_path unless basemaps.include?(params[:basemap]) && baselayers.include?(params[:baselayer])
      end
    end

end
