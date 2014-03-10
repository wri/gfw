class HomeController < ApplicationController
  skip_before_filter :check_terms, :only => [:accept_and_redirect]

  def index
    response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=WITH%20loss%20as%20(SELECT%20sum(loss_gt_0)%20as%20sum_loss,%20(SELECT%20sum(loss_gt_0)%20FROM%20umd%20WHERE%20year%20=%202012)%20as%20loss_2012%20FROM%20umd),%20gain%20as%20(SELECT%20sum(umd.gain)%20last_gain%20FROM%20(SELECT%20DISTINCT%20iso,%20gain%20FROM%20umd)%20umd),%20forma%20as%20(SELECT%20count(cartodb_id)%20FROM%20forma_api%20WHERE%20date%20%3E=%20(SELECT%20max(date)%20FROM%20forma_api))%20SELECT%20*%20from%20loss,%20gain,%20forma", headers: {"Accept" => "application/json"})
    @circles = response.success? ? JSON.parse(response.body)['rows'][0] : nil

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
end
