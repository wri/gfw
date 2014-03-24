class HomeController < ApplicationController
  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  before_filter :load_circles, :validate_url, :only => [:index]

  def index
    @visible = Api::Story.visible.first(3)
    @circles = load_circles
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

    def load_circles
      begin
        Rails.cache.fetch "circles", expires_in: 1.day do
          response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=WITH%20loss%20as%20(SELECT%20sum(loss_gt_0)%20as%20sum_loss,%20(SELECT%20sum(loss_gt_0)%20FROM%20umd%20WHERE%20year%20=%202012)%20as%20loss_2012%20FROM%20umd),%20gain%20as%20(SELECT%20sum(umd.gain)%20last_gain%20FROM%20(SELECT%20DISTINCT%20iso,%20gain%20FROM%20umd)%20umd),%20forma%20as%20(SELECT%20count(cartodb_id)%20FROM%20forma_api%20WHERE%20date%20%3E=%20(SELECT%20max(date)%20FROM%20forma_api))%20SELECT%20*%20from%20loss,%20gain,%20forma", headers: {"Accept" => "application/json"})
          response.success? ? JSON.parse(response.body)['rows'][0] : nil
        end
      rescue Exception => e
        Rails.logger.error "Error retrieving circles in the Home: #{e}"
      end
    end

end
