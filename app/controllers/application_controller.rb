class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception

  # before_action :check_browser

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  # TODO: no route?
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

    def is_embed_request?
      request.original_url.include?('embed') ? true : false
    end

end
