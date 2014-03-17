class ApplicationController < ActionController::Base
  helper_method :watch_cookie?

  protect_from_forgery with: :exception

  before_filter :check_browser
  before_filter :check_terms

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

    Browser = Struct.new(:browser, :version)

    SupportedBrowsers = [
      Browser.new('Safari', '5.0.5'),
      Browser.new('Firefox', '12.0'),
      Browser.new('Internet Explorer', '9.0'),
      Browser.new('Chrome', '19.0.1036.7'),
      Browser.new('Opera', '11.00')
    ]

    def check_browser
      user_agent = UserAgent.parse(request.user_agent)

      redirect_to "/notsupportedbrowser" unless SupportedBrowsers.detect { |browser| user_agent >= browser } || user_agent.bot?
    end

    def check_terms
      cookies[:go_to] ||= request.path

      unless watch_cookie? || controller_name == 'home'
        redirect_to accept_terms_path
      end
    end

    def watch_cookie?
      cookies.permanent[ENV['TERMS_COOKIE'].to_sym] || controller_name == 'embed' || UserAgent.parse(request.user_agent).bot?
    end

    def load_circles
      response = Typhoeus.get("https://wri-01.cartodb.com/api/v2/sql?q=WITH%20loss%20as%20(SELECT%20sum(loss_gt_0)%20as%20sum_loss,%20(SELECT%20sum(loss_gt_0)%20FROM%20umd%20WHERE%20year%20=%202012)%20as%20loss_2012%20FROM%20umd),%20gain%20as%20(SELECT%20sum(umd.gain)%20last_gain%20FROM%20(SELECT%20DISTINCT%20iso,%20gain%20FROM%20umd)%20umd),%20forma%20as%20(SELECT%20count(cartodb_id)%20FROM%20forma_api%20WHERE%20date%20%3E=%20(SELECT%20max(date)%20FROM%20forma_api))%20SELECT%20*%20from%20loss,%20gain,%20forma", headers: {"Accept" => "application/json"})
      @circles = response.success? ? JSON.parse(response.body)['rows'][0] : nil
    end

end
