class HomeController < ApplicationController
  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  before_filter :validate_url, :only => [:index]
  before_filter :load_circles, :only => [:index]

  def index
    @visible = Api::Story.visible.first(3)
  end

  def accept_and_redirect
    cookies.permanent[ENV['TERMS_COOKIE'].to_sym] = true

    if cookies[:go_to_from_blog].nil?
      if cookies[:go_to].nil?
        redirect = root_path
      elsif cookies[:go_to] == root_path
        redirect = map_path
      else
        redirect = cookies[:go_to]
      end
    else
      redirect = ENV['BLOG_HOST']
    end

    redirect_to redirect
  end

  private

    def validate_url
      baselayers = ['loss', 'forma', 'imazon', 'modis', 'none']
      basemaps = ['grayscale', 'terrain', 'satellite', 'roads', 'treeheight']

      for i in 1999..2012
        baselayers.push('landsat'+i.to_s)
      end

      redirect_to '/map/3/15.00/27.00/ALL/grayscale/loss' unless basemaps.include?(params[:basemap]) && baselayers.include?(params[:baselayer])
    end

end
