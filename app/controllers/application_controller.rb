class ApplicationController < ActionController::Base

  helper_method :terms_cookie

  protect_from_forgery with: :exception

  before_action :check_browser

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def accept_terms
    session[:return_to] = params[:return_to] unless params[:return_to].nil?
    @title = 'Terms of Service'
  end

  private

    def check_browser
      unless UserAgentValidator.user_agent_supported? request.user_agent
        redirect_to "/notsupportedbrowser"
      end
    end

    def check_terms
      puts request.original_url.to_s
      if request.original_url.to_s.include? "globalforestwatch.org"
        #Filtering accept terms only in PRO

        session[:return_to] = request.fullpath
        redirect_to accept_terms_path if show_terms?
      end
    end

    def show_terms?
      !(is_ip_whitelisted_from_terms? ||
        is_embed_request? ||
        terms_cookie ||
        is_exempt_from_terms?)
    end

    def is_ip_whitelisted_from_terms?
      @whitelist = [
        '80.74.134.135',
        # '127.0.0.1'
      ]

      @whitelist.include?(request.remote_ip)
    end

    def is_exempt_from_terms?
      validator = UserAgentValidator.new(request.user_agent)
      validator.bot? || validator.is_snippet_collector
    end

    def is_embed_request?
      request.original_url.include?('embed') ? true : false
    end

    def terms_cookie
      cookies.permanent[ENV['TERMS_COOKIE'].to_sym]
    end
end
